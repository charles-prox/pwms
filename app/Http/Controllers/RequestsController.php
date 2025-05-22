<?php

namespace App\Http\Controllers;

use App\Models\Request as RequestModel;
use App\Models\Box;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RequestsController extends Controller
{
    /**
     * Create a new blank request based on type and generate a unique form number.
     */
    public function createBlankRequest(string $type)
    {
        $type = strtolower($type);
        $user = Auth::user();

        $validTypes = [
            'storage'    => 'S',
            'withdrawal' => 'W',
            'return'     => 'R',
            'disposal'   => 'D',
        ];

        if (!array_key_exists($type, $validTypes)) {
            return response()->json(['error' => 'Invalid request type'], 400);
        }

        // ❌ Block if the user already has a draft of this type
        $existingDraft = RequestModel::where('request_type', $type)
            ->where('created_by', $user->id)
            ->where('is_draft', true)
            ->first();

        if ($existingDraft) {
            return response()->json([
                'message' => 'You already have an existing draft for this request type. Please complete or delete it before creating a new one.',
                'existing_form_no' => $existingDraft->form_number
            ], 409);
        }

        $prefix = $validTypes[$type];
        $year = Carbon::now()->year;
        // Get the latest request of the same type in the current year
        $latestRequest = RequestModel::where('request_type', $type)
            ->whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        // Extract the series number
        $lastSeries = 0;
        if ($latestRequest && preg_match('/\d{4}-(\d+)$/', $latestRequest->form_number ?? '', $matches)) {
            $lastSeries = (int) $matches[1];
        }

        $newSeries = str_pad($lastSeries + 1, 3, '0', STR_PAD_LEFT);
        $formNumber = "{$prefix}-{$year}-{$newSeries}";

        // Create the new request
        $request = new RequestModel();
        $request->request_type = $type;
        $request->status = 'draft';
        $request->is_draft = true;
        $request->form_number = $formNumber;
        $request->created_by = $user->id;
        $request->updated_by = $user->id;
        $request->office_id = $user->office_id ?? null;
        $request->created_at = now();
        $request->updated_at = now();
        $request->save();

        return response()->json([
            'message' => 'Blank request created successfully',
            'form_no' => $formNumber,
            // 'created_by' => $user->full_name,
            // 'request' => $request
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

        $boxes = Box::with(['documents.rds', 'office'])
            ->where('request_id', $request->id)
            ->get()
            ->map(function ($box) {
                return [
                    'id' => $box->id,
                    'box_code' => $box->box_code,
                    'priority_level' => $box->priority_level,
                    'remarks' => $box->remarks,
                    'disposal_date' => $box->disposal_date->format('Y-m-d'),
                    'office' => $box->office ? [
                        'id' => $box->office->id,
                        'name' => $box->office->name,
                    ] : null,
                    'box_details' => $box->documents->map(function ($doc) {
                        return [
                            'id' => $doc->id,
                            'document_title' => $doc->rds->title_description ?? null,
                            'rds_number' => $doc->rds->item_no ?? '',
                            'retention_period' => $doc->rds->storage ?? '',
                            'document_date' => [
                                'raw' => $doc->document_date,
                                'formatted' => \Carbon\Carbon::parse($doc->document_date)->format('m/d/Y'),
                            ],
                            'disposal_date' => [
                                'raw' => $doc->disposal_date,
                                'formatted' => \Carbon\Carbon::parse($doc->disposal_date)->format('m/d/Y'),
                            ],
                        ];
                    })->toArray()
                ];
            });

        return Inertia::render('RequestsPage', [
            'form' => [
                'number' => $request->form_number,
                'type' => ucfirst($request->request_type),
                'last_update' => $request->updated_at->format('m/d/Y'),
            ],
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

        $officeId = $user->office_id;

        $allRequests = RequestModel::with('creator')
            ->where('office_id', $officeId)
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($request) {
                $creator = $request->creator;
                $middleInitial = $creator->middle_name ? strtoupper(substr($creator->middle_name, 0, 1)) . '.' : '';
                $fullName = trim("{$creator->first_name} {$middleInitial} {$creator->last_name}");

                return [
                    'id' => $request->id,
                    'form_number' => $request->form_number,
                    'request_type' => ucfirst($request->request_type),
                    'status' => ucfirst($request->status),
                    'is_draft' => $request->is_draft,
                    'request_date' => $request->request_date ? $request->request_date->format('m/d/Y') : null,
                    'office_id' => $request->office_id,
                    'created_by' => $request->created_by,
                    'created_at' => $request->created_at ? $request->created_at->format('m/d/Y') : null,
                    'updated_at' => $request->updated_at ? $request->updated_at->format('m/d/Y') : null,
                    'completed_at' => $request->completed_at ? $request->completed_at->format('m/d/Y') : null,
                    'approved_at' => $request->approved_at ? $request->approved_at->format('m/d/Y') : null,
                    'creator' => $fullName,
                ];
            });


        return Inertia::render('RequestsPage', [
            'requests' => $allRequests
        ]);
    }

    public function saveDraft(Request $request, string $form_number)
    {
        $user = Auth::user();

        $requestData = RequestModel::where('form_number', $form_number)->firstOrFail();

        DB::beginTransaction();

        try {
            foreach ($request->boxes as $boxData) {
                // Save or update the box
                $box = Box::updateOrCreate(
                    [
                        'id' => $boxData['id'] ?? null,
                    ],
                    [
                        'box_code' => $boxData['box_code'],
                        'remarks' => $boxData['remarks'],
                        'priority_level' => $boxData['priority_level'],
                        'disposal_date' => $boxData['disposal_date'],
                        'status' => 'stored', // or whatever default applies
                        'office_id' => $requestData->office_id,
                        'request_id' => $requestData->id,
                    ]
                );

                // Save or update documents under the box
                foreach ($boxData['box_details'] as $doc) {
                    Document::updateOrCreate(
                        [
                            'id' => $doc['id'] ?? null,
                        ],
                        [
                            'box_id' => $box->id,
                            'rds_id' => $this->getRdsIdByNumber($doc['rds_number']),
                            'document_code' => null,
                            'description' => $doc['document_title'],
                            'document_date' => $doc['document_date']['raw'],
                            'disposal_date' => $doc['disposal_date']['raw'],
                            'status' => 'active',
                            'added_by' => $user->hris_id,
                        ]
                    );
                }
            }

            DB::commit();

            return response()->json(['message' => 'Draft saved successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to save draft', 'details' => $e->getMessage()], 500);
        }
    }

    // Helper to get RDS ID by number (optional)
    protected function getRdsIdByNumber(string $rdsNumber): ?int
    {
        $rds = \App\Models\RDS::where('item_no', $rdsNumber)->first();

        return $rds?->id;
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
