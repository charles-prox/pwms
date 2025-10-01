<?php

namespace App\Http\Controllers;

use App\Http\Resources\BoxResource;
use App\Http\Resources\RequestResource;
use App\Models\Box;
use App\Models\Office;
use App\Models\Request as RequestModel;
use App\Services\Requests\RequestFactoryService;
use App\Services\Requests\RequestStorageService;
use App\Services\Requests\RequestReturnService;
use App\Services\Requests\RequestStatusMessageService;
use App\Services\Requests\RequestStatusService;
use App\Services\Requests\RequestBoxService;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RequestsController extends Controller
{
    public function __construct(
        protected RequestStorageService $requestStorageService,
        protected RequestFactoryService $requestFactoryService,
        protected RequestReturnService $requestReturnService,
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
            ->orderBy('id', 'asc')
            ->first();

        if (!$request) {
            return $this->getAllRequests();
        }

        $withdrawnBoxes = Box::with([
            'documents.rds',
            'office',
            'boxLocation.location',
            'requests' => function ($query) {
                $query->whereHas('statusLogs', function ($logQuery) {
                    $logQuery->where('status', 'like', '%completed');
                })->with([
                    'statusLogs', // Load all status logs now
                ])->withPivot([
                    'storage_remarks',
                    'withdrawal_remarks',
                    'return_remarks',
                    'disposal_remarks',
                    'storage_completion_remarks',
                    'withdrawal_completion_remarks',
                    'return_completion_remarks',
                    'disposal_completion_remarks',
                ])->where('request_type', 'withdrawal');
            }
        ])
            ->where('status', 'withdrawn')
            ->get();
        // dd($withdrawnBoxes);

        $disposableBoxes = Box::with([
            'documents.rds',
            'office',
            'boxLocation.location',
            'requests' => function ($query) {
                $query->withPivot([
                    'storage_remarks',
                    'withdrawal_remarks',
                    'return_remarks',
                    'disposal_remarks',
                    'storage_completion_remarks',
                    'withdrawal_completion_remarks',
                    'return_completion_remarks',
                    'disposal_completion_remarks',
                ]);
            }
        ])
            ->disposable()
            ->get();
        // dd($request);
        return Inertia::render('RequestsPage', [
            'form' => (new RequestResource($request))
                ->withReturnService($this->requestReturnService)
                ->toArray(request()),
            'withdrawn_boxes' => BoxResource::collection($withdrawnBoxes)->toArray(request()),
            'disposable_boxes' => BoxResource::collection($disposableBoxes)->toArray(request()),
        ]);
    }


    public function getAllRequests()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $requests = RequestModel::with(['creator', 'boxes', 'office', 'statusLogs']) // preload relations to prevent N+1
            ->where('office_id', $user->office_id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $requestsTransformed = $requests->map(function ($request) {
            return (new RequestResource($request))
                ->withReturnService($this->requestReturnService)
                ->toArray(request());
        });

        return Inertia::render('RequestsPage', [
            'requests' => $requestsTransformed,
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
        $request = RequestModel::where('form_number', $form_number)->with('boxes.documents')->first();

        if (! $request) {
            return response()->json(['message' => 'Request not found.'], 404);
        }

        // Delete documents for each box in this request
        foreach ($request->boxes as $box) {
            $box->documents()->delete();
        }

        // Detach pivot relationship (removes records from request_box table)
        $request->boxes()->detach();

        // Optionally: delete the boxes too, if you’re sure they are not shared with other requests
        // foreach ($request->boxes as $box) {
        //     $box->delete();
        // }

        // Delete the request itself
        $request->delete();

        return response()->json(['message' => 'Request and related data deleted successfully.']);
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
        $query = RequestModel::with(['creator', 'office', 'boxes', 'statusLogs']) // preload all used relations
            ->where('is_draft', '!=', true)
            ->where('status', 'not like', '%completed')
            ->orderBy('updated_at', 'desc');

        if ($user->hasRole('regional-document-custodian')) {
            $query->where('status', 'pending');
        }

        $requests = $query->get();

        $requestsTransformed = $requests->map(function ($request) {
            return (new RequestResource($request))
                ->withReturnService($this->requestReturnService)
                ->toArray(request());
        });

        return Inertia::render('ManageRequests', [
            'pendingRequests' => $requestsTransformed,
        ]);
    }


    public function updateStatus(HttpRequest $request, RequestStatusService $service)
    {
        if (!isset($request['remarks']) || is_null($request['remarks'])) {
            $request->merge(['remarks' => ""]);
        }
        try {
            $service->authorizeUser();
            $validated = $service->validateRequest($request);
            $requestModel = RequestModel::findOrFail($validated['id']);
            if ($validated['status'] === 'approved') {
                $service->handleApprovedUpload($request, $requestModel);
            }

            $statusToLog = $validated['status'];

            if ($validated['status'] === 'completed') {
                if ($requestModel->request_type === 'storage') {
                    $service->assignBoxLocations($validated['boxes'], $requestModel);
                }

                if ($requestModel->request_type === 'withdrawal') {
                    // Get actual completion status from the service
                    $statusToLog = $service->confirmBoxWithdrawals($validated['boxes'], $requestModel);
                }

                if ($requestModel->request_type === 'return') {
                    // Get actual completion status from the service
                    $statusToLog = $service->confirmBoxReturn($validated['boxes'], $requestModel);
                }

                if ($requestModel->request_type === 'disposal') {
                    // Get actual completion status from the service
                    $statusToLog = $service->confirmBoxDisposal($validated['boxes'], $requestModel);
                }
            }

            $remarks = $validated['remarks'] ??
                RequestStatusMessageService::getDefaultRemark(
                    $statusToLog,
                    $requestModel->request_type
                );

            $requestModel->logStatus(
                $statusToLog,
                Auth::id(),
                $remarks,
            );

            return $this->manageRequests();
        } catch (ValidationException $e) {
            // Return validation errors to Inertia
            dd($e);
            // Handle other exceptions (log them or return a generic error)

            return Inertia::render('ManageRequests', [
                'errors' => $e->errors(),
            ])->toResponse(request())
                ->setStatusCode(422);
        } catch (\Throwable $e) {
            // Handle other exceptions (log them or return a generic error)
            dd($e);
            return back()->withErrors([
                'updateStatus' => 'Something went wrong: ' . $e->getMessage(),
            ])->withInput();
        }
    }
}
