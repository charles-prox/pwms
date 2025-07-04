<?php

namespace App\Services\Requests;

class RequestStatusMessageService
{
    public static function getDefaultRemark(string $status, string $requestType): ?string
    {
        if ($status === 'approved') {
            return match ($requestType) {
                'storage' => 'Proceed with transporting the boxes to the warehouse for storage. Coordinate with GSU for vehicle assistance and further instructions.',
                'withdrawal' => 'You may now proceed with withdrawing the boxes. Please coordinate with the records custodian.',
                'return' => 'You may now proceed with returning the boxes to the warehouse. Coordinate with GSU for vehicle assistance',
                'disposal' => 'Proceed with the disposal process as scheduled.',
                default => 'Request approved. Please proceed accordingly.',
            };
        }

        return null; // Only provide default remarks for "approved" status
    }
}
