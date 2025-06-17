<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['office', 'position', 'requests'])->get();
        // dd($users);
        return Inertia::render('Users', [
            'users' => $users
        ]);
    }
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
