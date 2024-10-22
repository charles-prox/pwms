<?php

namespace App\Http\Controllers;

use App\Http\Middleware\AdminCheck;
use Laravel\Fortify\Http\Controllers\RegisteredUserController as JetstreamRegisteredUserController;

class RegisterAdminController extends JetstreamRegisteredUserController
{
    // Add your custom middleware to the constructor
    public function __construct()
    {
        $this->middleware(AdminCheck::class);
    }
}
