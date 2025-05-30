<?php

namespace App\Http\Controllers;

use App\Models\Request as RequestModel;
use App\Models\Box;
use App\Models\RDS;
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
                    'priority_level' => $box->priority_level ? [
                        'value' => $box->priority_level,
                        'label' => ucfirst($box->priority_level),
                    ] : null,
                    'remarks' => $box->remarks,
                    'disposal_date' => $box->is_permanent
                        ? 'Permanent'
                        : [
                            'raw' => $box->disposal_date?->toISOString(), // Ensures ISO format
                            'formatted' => $box->disposal_date?->format('F j, Y'),
                        ],
                    'office' => $box->office ? [
                        'id' => $box->office->id,
                        'name' => $box->office->name,
                    ] : null,
                    'box_details' => $box->documents->map(function ($doc) {
                        $active = trim($doc->rds->active);
                        $storage = trim($doc->rds->storage);

                        $retention_period = (strcasecmp($active, "Permanent") === 0 || strcasecmp($storage, "Permanent") === 0)
                            ? "Permanent"
                            : ((int) $active + (int) $storage);

                        return [
                            'id' => $doc->id,
                            'document_code' => $doc->document_code,
                            'document_title' => $doc->rds->title_description ?? null,
                            'rds_number' => "RDS-" . $doc->rds->module . " #" . $doc->rds->item_no,
                            'retention_period' => $retention_period,
                            'document_date' => $doc->document_date_start || $doc->document_date_end ? [
                                'start' => $doc->document_date_start ? [
                                    'raw' => $doc->document_date_start->toISOString(),
                                    'formatted' => $doc->document_date_start->format('F j, Y'),
                                ] : null,
                                'end' => $doc->document_date_end ? [
                                    'raw' => $doc->document_date_end->toISOString(),
                                    'formatted' => $doc->document_date_end->format('F j, Y'),
                                ] : null,
                            ] : null,
                            'disposal_date' => $doc->is_permanent
                                ? 'Permanent'
                                : [
                                    'raw' => $doc->disposal_date?->toISOString(),
                                    'formatted' => $doc->disposal_date?->format('F j, Y'),
                                ],
                        ];
                    })->toArray(),
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
        // dd($request->boxes);
        try {
            foreach ($request->boxes as $boxData) {
                $rawDisposalDate = is_array($boxData['disposal_date']) ? $boxData['disposal_date']['raw'] : $boxData['disposal_date'];
                $isPermanentBox = strtolower($rawDisposalDate) === 'permanent';

                // Save or update the box
                $box = Box::updateOrCreate(
                    [
                        'box_code' => $boxData['box_code'],
                    ],
                    [
                        'remarks' => $boxData['remarks'],
                        'priority_level' => is_array($boxData['priority_level'])
                            ? $boxData['priority_level']['value']
                            : $boxData['priority_level'],
                        'disposal_date' => $isPermanentBox ? null : $rawDisposalDate,
                        'is_permanent' => $isPermanentBox,
                        'status' => 'draft',
                        'office_id' => $user->office_id,
                        'request_id' => $requestData->id,
                    ]
                );

                // Save or update documents under the box
                foreach ($boxData['box_details'] as $doc) {
                    $rawDocDisposalDate = is_array($doc['disposal_date']) ? $doc['disposal_date']['raw'] : $doc['disposal_date'];
                    $isPermanentDoc = strtolower($rawDocDisposalDate) === 'permanent';
                    dd($doc['document_date']);
                    $docDateStart = $doc['document_date']['start']['raw'] ?? null;
                    $docDateEnd = $doc['document_date']['end']['raw']
                        ?? $doc['document_date']['start']['raw']
                        ?? null;

                    Document::updateOrCreate(
                        [
                            'box_id' => $box->id,
                            'document_code' => $doc['document_code'],
                        ],
                        [
                            'rds_id' => $doc['id'],
                            'document_date_from' => $docDateStart,
                            'document_date_to' => $docDateEnd,
                            'disposal_date' => $isPermanentDoc ? null : $rawDocDisposalDate,
                            'is_permanent' => $isPermanentDoc,
                            'status' => 'draft',
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
