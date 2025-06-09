<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    /**
     * Display the specified user by ID.
     */
    public function show($id)
    {
        $user = User::with('office') // optional: eager-load related office
            ->findOrFail($id);

        return response()->json((new UserResource($user))->toArray(request()));
    }
}
