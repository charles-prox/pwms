<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use Inertia\Inertia;
use App\Http\Resources\UserResource;
use App\Services\UserService;

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

    public function create()
    {
        return Inertia::render('Users/Modules/Create', [
            'roles' => Role::all(), // pass roles if needed
        ]);
    }

    public function store(StoreUserRequest $request, UserService $userService)
    {
        $userService->create($request->validated());

        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }
}
