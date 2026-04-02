<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Only admin can manage users
        if (! Auth::user()->isAdmin()) {
            abort(403, 'Only administrators can manage users.');
        }

        $users = User::whereIn('role', ['admin', 'manager'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        if (! Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role'     => ['required', 'in:admin,manager'],
        ]);

        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        return back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        if (! Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role'  => ['required', 'in:admin,manager'],
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'role'  => $validated['role'],
        ]);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if (! Auth::user()->isAdmin()) {
            abort(403);
        }

        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
