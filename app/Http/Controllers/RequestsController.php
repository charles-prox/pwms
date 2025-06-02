<?php

namespace App\Http\Controllers;

use App\Models\Request as RequestModel;
use App\Models\Box;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Services\Requests\RequestStorageService;
use App\Services\Requests\RequestFactoryService;
use App\Http\Resources\RequestResource;
use App\Http\Resources\BoxResource;


class RequestsController extends Controller
{
    public function __construct(protected RequestStorageService $requestStorageService, protected RequestFactoryService $requestFactoryService) {}
    /**
     * Create a new blank request based on type and generate a unique form number.
     */
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

    /**
     * Get the details of a specific request form based on type and form number.
     */
    public function getFormDetails(string $form_no)
    {
        $request = RequestModel::where('form_number', $form_no)->first();

        if (!$request) {
            return $this->getAllRequests();
        }

        $boxes = BoxResource::collection(
            Box::with(['documents.rds', 'office'])
                ->where('request_id', $request->id)
                ->get()
        )->toArray(request());
        // dd($boxes);
        return Inertia::render('RequestsPage', [
            'form' => (new RequestResource($request))->toArray(request()),
            'boxes' => $boxes,
        ]);
    }



    /**
     * Get all draft requests for the authenticated user's office.
     */
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


    public function saveDraft(Request $request, string $form_number)
    {
        DB::beginTransaction();
        try {
            $this->requestStorageService->saveRequestData($request, $form_number, 'draft');
            DB::commit();

            return response()->json(['message' => 'Draft saved successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to save draft', 'details' => $e->getMessage()], 500);
        }
    }

    public function submitRequest(Request $request, string $form_number)
    {
        DB::beginTransaction();
        try {
            $this->requestStorageService->saveRequestData($request, $form_number, 'submitted');
            DB::commit();

            return response()->json(['message' => 'Request submitted successfully', 'show_form' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to submit request', 'details' => $e->getMessage()], 500);
        }
    }


    public function destroy($form_number)
    {
        $request = RequestModel::where('form_number', $form_number)->first();

        if (!$request) {
            return response()->json([
                'message' => 'Request not found.',
            ], 404);
        }

        $request->delete();

        return response()->json([
            'message' => 'Request deleted successfully.',
        ]);
    }
}
