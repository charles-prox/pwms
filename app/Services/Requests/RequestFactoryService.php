<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Box;
use App\Models\Officer;
use App\Models\Office;
use App\Http\Resources\BoxResource;

class RequestFactoryService
{
    protected array $validTypes = [
        'storage'    => 'S',
        'withdrawal' => 'W',
        'return'     => 'R',
        'disposal'   => 'D',
    ];

    protected RequestStorageService $storageService;
    protected RequestWithdrawalService $withdrawalService;

    public function __construct(
        RequestStorageService $storageService,
        RequestWithdrawalService $withdrawalService
    ) {
        $this->storageService = $storageService;
        $this->withdrawalService = $withdrawalService;
    }


    /**
     * Create a new blank request of the given type for the authenticated user.
     *
     * @param string $type
     * @return array ['success' => bool, 'message' => string, 'form_no' => ?string, 'existing_form_no' => ?string]
     */
    public function createBlankRequest(string $type): array
    {
        $type = strtolower($type);

        if (!isset($this->validTypes[$type])) {
            return ['success' => false, 'message' => 'Invalid request type'];
        }

        $user = Auth::user();

        // Prevent duplicate drafts per office per type
        $existingDraft = RequestModel::where('request_type', $type)
            ->where('office_id', $user->office_id)
            ->where('is_draft', true)
            ->first();

        if ($existingDraft) {
            return [
                'success' => false,
                'message' => 'There\'s an existing draft for this request type. Please complete or delete it before creating a new one.',
                'existing_form_no' => $existingDraft->form_number,
            ];
        }

        $prefix = $this->validTypes[$type];
        $year = now()->year;

        // Get the latest sequence for this year and type
        $lastSequence = RequestModel::where('request_type', $type)
            ->where('form_year', $year)
            ->orderByDesc('form_sequence')
            ->value('form_sequence') ?? 0;

        $newSequence = $lastSequence + 1;
        $formNumber = "{$prefix}-{$year}-" . str_pad($newSequence, 3, '0', STR_PAD_LEFT);
        $request = RequestModel::create([
            'form_number'   => $formNumber,
            'request_type'  => $type,
            'status'        => 'draft',
            'is_draft'      => true,
            'created_by'    => $user->id,
            'updated_by'    => $user->id,
            'office_id'     => $user->office_id ?? null,
            'form_year'     => $year,
            'form_sequence' => $newSequence,
        ]);

        return [
            'success' => true,
            'message' => 'Blank request created successfully',
            'form_no' => $formNumber,
        ];
    }

    public function saveRequest(HttpRequest $request, string $formNumber, string $status = 'draft'): void
    {
        DB::transaction(function () use ($request, $formNumber, $status) {
            $form = RequestModel::where('form_number', $formNumber)->firstOrFail();

            match (strtolower($form->request_type)) {
                'storage' => $this->storageService->saveRequestData($request, $formNumber, $status),
                'withdrawal' => $this->withdrawalService->saveRequestData($request, $formNumber, $status),
                default => throw new \Exception("Unsupported request type: {$form->request_type}"),
            };
        });
    }

    public function getRequestDetailsWithBoxesAndOfficers($requestId)
    {
        $request = RequestModel::with(['creator.office'])->findOrFail($requestId);

        $creator = $request->creator;
        $creatorOffice = $creator->office;

        // Get office heads & RDC officer (same for all request types)
        $creatorOfficeHead = Officer::with('positions')->whereHas('positions', function ($query) use ($creatorOffice) {
            $query->where('name', 'like', '%Head%')
                ->where('name', 'like', '%' . $creatorOffice->name . '%');
        })->first();

        $gsuOffice = Office::where('acronym', 'GSU')->first();
        $gsuHead = $gsuOffice ? Officer::with('positions')->whereHas('positions', function ($query) use ($gsuOffice) {
            $query->where('name', 'like', '%Head%')
                ->where('name', 'like', '%' . $gsuOffice->name . '%');
        })->first() : null;

        $msdOffice = Office::where('acronym', 'OMSD')->first();
        $msdHead = $msdOffice ? Officer::with('positions')->whereHas('positions', function ($query) use ($msdOffice) {
            $query->where('name', 'like', '%Chief%')
                ->where('name', 'like', '%' . $msdOffice->name . '%');
        })->first() : null;

        $rdcOfficer = Officer::with('positions')->whereHas('positions', function ($query) {
            $query->where('code', 'rdc');
        })->first();

        // Get boxes depending on request type
        $boxes = match (strtolower($request->request_type)) {
            'storage' => BoxResource::collection(
                Box::with(['documents.rds', 'office', 'boxLocation.location'])
                    ->where('request_id', $request->id)
                    ->get()
            )->toArray(request()),

            'withdrawal' => BoxResource::collection(
                $request->boxesWithRequestRemarks()
                    ->with(['documents.rds', 'office', 'boxLocation.location'])
                    ->get()
            )->toArray(request()),

            default => [],
        };

        return [
            'request' => [
                'type' => strtolower($request->request_type),
                'form_number' => $request->form_number,
                'boxes' => $boxes,
                'creator' => $request->creator,
            ],
            'creator_office_head' => $creatorOfficeHead,
            'gsu_head' => $gsuHead,
            'msd_head' => $msdHead,
            'rdc_officer' => $rdcOfficer,
        ];
    }
}
