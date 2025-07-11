<?php

namespace App\Http\Controllers;

use App\Http\Resources\BoxResource;
use App\Http\Resources\RequestResource;
use App\Models\Box;
use App\Models\Office;
use App\Models\Request as RequestModel;
use App\Services\Requests\RequestFactoryService;
use App\Services\Requests\RequestStorageService;
use App\Services\Requests\RequestStatusMessageService;
use App\Services\Requests\RequestStatusService;
use App\Services\Requests\RequestBoxService;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RequestsController extends Controller
{
    public function __construct(
        protected RequestStorageService $requestStorageService,
        protected RequestFactoryService $requestFactoryService,
        protected RequestBoxService $requestBoxService
    ) {}

    public function createBlankRequest(string $type)
    {
        $result = $this->requestFactoryService->createBlankRequest($type);

        if (!$result['success']) {
            return response()->json(
                $result['existing_form_no'] ?? ['error' => $result['message']],
                $result['existing_form_no'] ? 409 : 400
            );
        }

        return response()->json([
            'message' => $result['message'],
            'form_no' => $result['form_no'],
        ]);
    }

    public function getFormDetails(string $form_no)
    {
        $request = RequestModel::with([
            'statusLogs.updatedBy',
            'boxes.documents.rds',
            'boxes.office',
            'boxes.boxLocation.location',
            'creator',
            'office',
        ])
            ->where('form_number', $form_no)
            ->first();

        if (!$request) {
            return $this->getAllRequests();
        }

        return Inertia::render('RequestsPage', [
            'form' => (new RequestResource($request))->toArray(request()),
        ]);
    }

    public function getAllRequests()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $requests = RequestModel::with('creator')
            ->where('office_id', $user->office_id)
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('RequestsPage', [
            'requests' => RequestResource::collection($requests)->toArray(request()),
        ]);
    }

    public function saveDraft(HttpRequest $request, string $form_number)
    {
        try {
            $this->requestFactoryService->saveRequest($request, $form_number, 'draft');

            return response()->json(['message' => 'Draft saved successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to save draft', 'details' => $e->getMessage()], 500);
        }
    }


    public function submitRequest(HttpRequest $request, string $form_number)
    {
        try {

            $this->requestFactoryService->saveRequest($request, $form_number, 'pending');

            $form = RequestModel::where('form_number', $form_number)->firstOrFail();

            return Inertia::render('RequestsPage', [
                'show_form' => true,
                'form_details' => $this->requestFactoryService->getRequestDetailsWithBoxesAndOfficers($form->id),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to submit request',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function destroy(string $form_number)
    {
        $request = RequestModel::where('form_number', $form_number)->first();

        if (!$request) {
            return response()->json(['message' => 'Request not found.'], 404);
        }

        $request->delete();

        return response()->json(['message' => 'Request deleted successfully.']);
    }

    public function uploadPdf(HttpRequest $request)
    {
        $request->validate([
            'pdf' => 'required|file|mimes:pdf',
            'request_id' => 'required|exists:requests,form_number',
        ]);

        $path = $request->file('pdf')->storeAs(
            'requests/pdfs',
            'request-' . $request->request_id . '.pdf',
            'public'
        );

        RequestModel::where('form_number', $request->request_id)->update([
            'pdf_path' => 'storage/' . $path,
        ]);

        return response()->json(['message' => 'PDF saved successfully.']);
    }

    public function generateBoxCode(HttpRequest $request, Office $office)
    {
        $boxCodes = $request->input('boxCodes', []);
        return response()->json(['box_code' => $this->requestStorageService->generateBoxCode($office, $boxCodes)]);
    }

    public function manageRequests()
    {
        /** @var \App\Models\User|\Spatie\Permission\Traits\HasRoles $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Allow only super-admin and regional-document-custodian
        if (!$user->hasAnyRole(['super-admin', 'regional-document-custodian'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Build query based on role
        $query = RequestModel::with(['creator', 'office', 'boxes'])
            ->where('is_draft', '!=', true)
            ->where('status', '!=', 'completed')
            ->orderBy('updated_at', 'desc');

        if ($user->hasRole('regional-document-custodian')) {
            $query->where('status', 'pending');
        }

        $requests = $query->get();

        return Inertia::render('ManageRequests', [
            'pendingRequests' => RequestResource::collection($requests)->toArray(request()),
        ]);
    }



    public function updateStatus(HttpRequest $request, RequestStatusService $service)
    {
        try {
            $service->authorizeUser();
            $validated = $service->validateRequest($request);
            $requestModel = RequestModel::findOrFail($validated['id']);
            if ($validated['status'] === 'approved') {
                $service->handleApprovedUpload($request, $requestModel);
            }

            if ($validated['status'] === 'completed') {
                $service->assignBoxLocations($validated['boxes'], $requestModel);
            }

            $remarks = $validated['remarks'] ??
                RequestStatusMessageService::getDefaultRemark(
                    $validated['status'],
                    $requestModel->request_type
                );
            $requestModel->logStatus(
                $validated['status'],
                Auth::id(),
                $remarks,
            );

            return $this->manageRequests();
        } catch (\Throwable $e) {
            // Log the error for debugging
            return back()->withErrors([
                'updateStatus' => 'Something went wrong while updating the status. ' . $e->getMessage(),
            ]);
        }
    }
}
