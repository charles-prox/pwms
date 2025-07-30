<?php

namespace App\Enums;

enum RequestStatus: string
{
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Completed = 'completed';
}
