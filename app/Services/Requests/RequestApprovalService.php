<?php

namespace App\Services\Requests;

use App\Models\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;

class RequestApprovalService
{
    /**
     * Approve a request if authorized.
     *
     * @param Request $requestModel
     * @throws AuthorizationException
     */
    public function approve(Request $requestModel): void
    {
        // Authorize via policy
        $this->authorizeApproval($requestModel);

        DB::transaction(function () use ($requestModel) {
            $userId = Auth::id();

            $requestModel->update([
                'approved_at' => now(),
                'approved_by' => $userId,
                'status' => 'approved',
            ]);

            $requestModel->statusLogs()->create([
                'status' => 'approved',
                'remarks' => 'Request approved.',
                'updated_by' => $userId,
            ]);
        });
    }

    /**
     * Wrapper for authorizing the approval action.
     *
     * @param Request $requestModel
     * @throws AuthorizationException
     */
    protected function authorizeApproval(Request $requestModel): void
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->can('approve', $requestModel)) {
            throw new AuthorizationException('You are not authorized to approve this request.');
        }
    }
}
