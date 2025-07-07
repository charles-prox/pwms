<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\DB;

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

            match ($form->request_type) {
                'Storage' => $this->storageService->saveRequestData($request, $formNumber, $status),
                'Withdrawal' => $this->withdrawalService->saveRequestData($request, $formNumber, $status),
                default => throw new \Exception("Unsupported request type: {$form->request_type}"),
            };
        });
    }
}
