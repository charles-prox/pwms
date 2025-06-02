<?php

namespace App\Services\Requests;

use App\Models\Box;
use App\Models\Document;
use App\Models\Request as RequestModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestStorageService
{
    public function saveRequestData(Request $request, string $form_number, string $status = 'draft')
    {
        $user = Auth::user();
        $requestData = RequestModel::where('form_number', $form_number)->firstOrFail();

        if ($status === 'draft') {
            $requestData->update([
                'updated_by' => $user->id,
                'updated_at' => now(),
            ]);
        } else {
            $requestData->update([
                'status' => 'pending',
                'request_date' => now(),
                'office_id' => $user->office_id,
                'is_draft' => false,
                'updated_by' => $user->id,
                'updated_at' => now(),
            ]);
        }


        foreach ($request->boxes as $boxData) {
            $rawDisposalDate = is_array($boxData['disposal_date']) ? $boxData['disposal_date']['raw'] : $boxData['disposal_date'];
            $isPermanentBox = strtolower($rawDisposalDate) === 'permanent';

            $box = Box::updateOrCreate(
                ['box_code' => $boxData['box_code']],
                [
                    'remarks' => $boxData['remarks'],
                    'priority_level' => is_array($boxData['priority_level'])
                        ? $boxData['priority_level']['value']
                        : $boxData['priority_level'],
                    'disposal_date' => $isPermanentBox ? null : $rawDisposalDate,
                    'is_permanent' => $isPermanentBox,
                    'status' => $status,
                    'office_id' => $user->office_id,
                    'request_id' => $requestData->id,
                ]
            );

            foreach ($boxData['box_details'] as $doc) {
                $rawDocDisposalDate = is_array($doc['disposal_date']) ? $doc['disposal_date']['raw'] : $doc['disposal_date'];
                $isPermanentDoc = strtolower($rawDocDisposalDate) === 'permanent';

                $docDateStart = $doc['document_date']['start']['raw'] ?? null;
                $docDateEnd = $doc['document_date']['end']['raw'] ?? $docDateStart;

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
                        'status' => $status,
                        'added_by' => $user->hris_id,
                    ]
                );
            }
        }
    }
}
