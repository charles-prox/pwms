<?php

namespace App\Http\Controllers;

use App\Http\Middleware\AdminCheck;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;

class LoginController extends AuthenticatedSessionController
{
    // Add your custom middleware to the constructor
    public function __construct()
    {
        $this->middleware(AdminCheck::class);
    }
}
