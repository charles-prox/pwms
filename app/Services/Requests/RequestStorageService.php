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
        });
    }
    /**
     * Get request details along with boxes and officers.
     *
     * @param int $requestId
     * @return array
     */
    public function getRequestDetailsWithBoxesAndOfficers($requestId)
    {
        $request = RequestModel::with([
            'boxes.documents',
            'creator.office'
        ])->findOrFail($requestId);

        $creator = $request->creator;
        $creatorOffice = $creator->office;

        // Get head of creator's office (with positions)
        $creatorOfficeHead = Officer::with('positions')->whereHas('positions', function ($query) use ($creatorOffice) {
            $query->where('name', 'like', '%Head%')
                ->where('name', 'like', '%' . $creatorOffice->name . '%');
        })->first();


        // Get head of GSU with positions
        $gsuOffice = Office::where('acronym', 'GSU')->first();
        $gsuHead = $gsuOffice ? Officer::with('positions')->whereHas('positions', function ($query) use ($gsuOffice) {
            $query->where('name', 'like', '%Head%')
                ->where('name', 'like', '%' . $gsuOffice->name . '%');
        })->first() : null;

        // Get head of MSD with positions
        $msdOffice = Office::where('acronym', 'OMSD')->first();
        $msdHead = $msdOffice ? Officer::with('positions')->whereHas('positions', function ($query) use ($msdOffice) {
            $query->where('name', 'like', '%Chief%')
                ->where('name', 'like', '%' . $msdOffice->name . '%');
        })->first() : null;

        // Get RDC officer with positions
        $rdcOfficer = Officer::with('positions')->whereHas('positions', function ($query) {
            $query->where('code', 'rdc');
        })->first();


        return [
            'request' => [
                'type' => 'storage',
                'form_number' => $request->form_number,
                'boxes' => BoxResource::collection($request->boxes)->toArray(request()),
                'creator' => $request->creator,
            ],
            'creator_office_head' => $creatorOfficeHead,
            'gsu_head' => $gsuHead,
            'msd_head' => $msdHead,
            'rdc_officer' => $rdcOfficer,
        ];
    }

    /**
     * Generate a unique box code for the given office.
     *
     * @param Office $office
     * @return string
     */
    public function generateBoxCode(Office $office, int $addedInFrontend = 0): string
    {
        $year = now()->year;
        $latestCount = Box::where('office_id', $office->id)
            ->whereYear('created_at', $year)
            ->count();

        $series = $latestCount + $addedInFrontend + 1;

        return sprintf('%s-%03d-%d', strtoupper($office->acronym), $series, $year);
    }
}
