<?php

namespace App\Services\Requests;

use App\Models\Box;
use App\Models\Document;
use App\Models\Request as RequestModel;
use Illuminate\Support\Carbon;
use App\Models\Officer;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BoxResource;
use Illuminate\Support\Facades\DB;

class RequestStorageService
{
    /**
     * Save request data including boxes and documents.
     *
     * @param Request $request
     * @param string $form_number
     * @param string $status
     * @return void
     */
    public function saveRequestData(Request $request, string $form_number, string $status = 'draft')
    {
        $user = Auth::user();

        DB::transaction(function () use ($request, $form_number, $status, $user) {
            $requestData = RequestModel::where('form_number', $form_number)->firstOrFail();

            if ($status === 'draft') {
                $requestData->update([
                    'updated_by' => $user->id,
                ]);
            } else {
                $requestData->update([
                    'status' => 'pending',
                    'submitted_at' => now(),
                    'office_id' => $user->office_id,
                    'is_draft' => false,
                    'updated_by' => $user->id,
                ]);

                $requestData->logStatus('pending', $user->id, 'Request submitted for review and approval.');
            }

            $pivotData = [];

            foreach ($request->boxes as $boxData) {
                $rawDisposalDate = is_array($boxData['disposal_date']) ? $boxData['disposal_date']['raw'] : $boxData['disposal_date'];
                $isPermanentBox = strtolower($rawDisposalDate) === 'permanent';

                $box = Box::updateOrCreate(
                    ['box_code' => $boxData['box_code']],
                    [
                        'priority_level' => is_array($boxData['priority_level'])
                            ? $boxData['priority_level']['value']
                            : $boxData['priority_level'],
                        'disposal_date' => $isPermanentBox ? null : $rawDisposalDate,
                        'is_permanent' => $isPermanentBox,
                        'status' => $status . ' storage',
                        'office_id' => $user->office_id,
                    ]
                );

                // Prepare pivot data for remarks (STORAGE request type here)
                $pivotData[$box->id] = [
                    'storage_remarks' => $boxData['remarks'] ?? null,
                ];

                // Save documents inside box
                foreach ($boxData['box_details'] as $doc) {
                    $rawDocDisposalDate = is_array($doc['disposal_date']) ? $doc['disposal_date']['raw'] : $doc['disposal_date'];
                    $isPermanentDoc = strtolower($rawDocDisposalDate) === 'permanent';
                    $docDateStart = $doc['document_date']['start']['raw'] ?? null;
                    $docDateEnd = $doc['document_date']['end']['raw'] ?? $docDateStart;

                    $box->documents()->updateOrCreate(
                        [
                            'document_code' => $doc['document_code'],
                        ],
                        [
                            'rds_id' => $doc['id'],
                            'document_date_from' => $docDateStart,
                            'document_date_to' => $docDateEnd,
                            'disposal_date' => $isPermanentDoc ? null : $rawDocDisposalDate,
                            'is_permanent' => $isPermanentDoc,
                            'status' => $status,
                            'added_by' => $user->hris_id,
                        ]
                    );
                }
            }

            // Sync boxes with pivot remarks
            $requestData->boxes()->sync($pivotData);
        });
    }



    /**
     * Generate a unique box code for the given office.
     *
     * @param Office $office
     * @return string
     */
    public function generateBoxCode(Office $office, array $boxCodes): string
    {
        $year = now()->year;
        // Count boxes already saved in DB for this office & year
        $existingOfficeBoxCount = Box::where('office_id', $office->id)
            ->whereYear('created_at', $year)
            ->count();

        // Count how many of the draft box IDs already exist in DB (cross-request duplicates)
        $existingDraftBoxCount = Box::whereIn('box_code', $boxCodes)->count();

        // Total boxes in draft
        $totalDraftCount = count($boxCodes);

        // New boxes in draft (those not yet saved)
        $newDraftBoxCount = $totalDraftCount - $existingDraftBoxCount;
        // dd($existingOfficeBoxCount, $newDraftBoxCount, $existingDraftBoxCount);
        // Series number: boxes already saved in office + new boxes in draft + 1 (for this new box)
        $series = $existingOfficeBoxCount + $newDraftBoxCount + 1;

        return sprintf('%s-%03d-%d', strtoupper($office->acronym), $series, $year);
    }
}
