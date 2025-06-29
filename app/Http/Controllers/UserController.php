<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
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

    public function edit(User $user)
    {
        $user->load(['office', 'position', 'roles']); // load relationships as needed

        return Inertia::render('Users/Modules/Edit', [
            'defaultValues' => (new UserResource($user))->toArray(request()),
            'roles' => Role::all(),
        ]);
    }

    public function store(StoreUserRequest $request, UserService $userService)
    {
        $result = $userService->create($request->validated());

        return Inertia::render('Users/Modules/Create', [
            'response' => $result,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user, UserService $userService)
    {
        $result = $userService->update($user, $request->validated());

        return Inertia::render('Users/Modules/Edit', [
            'response' => $request->validated(),
        ]);
    }
}
