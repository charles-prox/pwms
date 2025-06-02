<?php

namespace App\Services\Requests;

use App\Models\Request as RequestModel;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RequestFactoryService
{
    protected array $validTypes = [
        'storage'    => 'S',
        'withdrawal' => 'W',
        'return'     => 'R',
        'disposal'   => 'D',
    ];

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

        $existingDraft = RequestModel::where('request_type', $type)
            ->where('created_by', $user->id)
            ->where('is_draft', true)
            ->first();

        if ($existingDraft) {
            return [
                'success' => false,
                'message' => 'You already have an existing draft for this request type. Please complete or delete it before creating a new one.',
                'existing_form_no' => $existingDraft->form_number,
            ];
        }

        $prefix = $this->validTypes[$type];
        $year = Carbon::now()->year;

        $latestRequest = RequestModel::where('request_type', $type)
            ->whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $lastSeries = 0;
        if ($latestRequest && preg_match('/\d{4}-(\d+)$/', $latestRequest->form_number ?? '', $matches)) {
            $lastSeries = (int) $matches[1];
        }

        $newSeries = str_pad($lastSeries + 1, 3, '0', STR_PAD_LEFT);
        $formNumber = "{$prefix}-{$year}-{$newSeries}";

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

        return [
            'success' => true,
            'message' => 'Blank request created successfully',
            'form_no' => $formNumber,
        ];
    }
}
