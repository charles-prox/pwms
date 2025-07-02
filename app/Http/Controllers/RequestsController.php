<?php

namespace App\Http\Controllers;

use App\Http\Resources\BoxResource;
use App\Http\Resources\RequestResource;
use App\Models\Box;
use App\Models\Office;
use App\Models\Request as RequestModel;
use App\Services\Requests\RequestFactoryService;
use App\Services\Requests\RequestStorageService;
use App\Services\Requests\RequestApprovalService;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RequestsController extends Controller
{
    public function __construct(
        protected RequestStorageService $requestStorageService,
        protected RequestFactoryService $requestFactoryService,
        protected RequestApprovalService $requestApprovalService
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
        $request = RequestModel::with(['statusLogs.updatedBy'])
            ->where('form_number', $form_no)
            ->first();

        if (!$request) {
            return $this->getAllRequests();
        }

        $boxes = BoxResource::collection(
            Box::with(['documents.rds', 'office'])
                ->where('request_id', $request->id)
                ->get()
        )->toArray(request());

        return Inertia::render('RequestsPage', [
            'form' => (new RequestResource($request))->toArray(request()),
            'boxes' => $boxes,
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
            DB::transaction(fn() => $this->requestStorageService->saveRequestData($request, $form_number, 'draft'));
            return response()->json(['message' => 'Draft saved successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to save draft', 'details' => $e->getMessage()], 500);
        }
    }

    public function submitRequest(HttpRequest $request, string $form_number)
    {
        try {
            DB::transaction(fn() => $this->requestStorageService->saveRequestData($request, $form_number, 'submitted'));

            return Inertia::render('RequestsPage', [
                'show_form' => true,
                'form_details' => $this->requestStorageService->getRequestDetailsWithBoxesAndOfficers(
                    RequestModel::where('form_number', $form_number)->value('id')
                ),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to submit request', 'details' => $e->getMessage()], 500);
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
        $existing = (int) $request->get('existingCount', 0);
        return response()->json(['box_code' => $this->requestStorageService->generateBoxCode($office, $existing)]);
    }

    public function approve(string $id)
    {
        $requestModel = RequestModel::findOrFail($id);
        $this->authorize('approve', $requestModel);

        $this->requestApprovalService->approve($requestModel);

        return response()->json(['message' => 'Request approved']);
    }

    public function manageRequests()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Allow only super-admin and regional-record-custodian
        if (!$user->hasAnyRole(['super-admin', 'regional-record-custodian'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $requests = RequestModel::with(['creator', 'office'])
            ->where('status', 'pending')
            ->where('is_draft', '!=', true)
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('ManageRequests', [
            'pendingRequests' => RequestResource::collection($requests)->toArray(request()),
        ]);
    }

    public function updateStatus(HttpRequest $request, RequestModel $requestModel)
    {
        // Authorization: Allow only super-admin or RRC
        if (!Auth::user()->hasAnyRole(['super-admin', 'regional-record-custodian'])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:approved,rejected',
            'remarks' => 'nullable|string|max:1000',
        ]);

        // Update the request record
        $requestModel->update([
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        // Optional: Create a status log if your system tracks history
        $requestModel->statusLogs()->create([
            'status' => $validated['status'],
            'remarks' => $validated['remarks'],
            'updated_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Request status updated successfully.',
        ]);
    }
}
