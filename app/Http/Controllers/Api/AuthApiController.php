<?php

namespace App\Http\Controllers\Api;

use App\Domains\User\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthApiController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid login credentials.'
            ], 401);
        }

        if ($user->status !== 1) {
            return response()->json([
                'message' => 'Your account is deactivated.'
            ], 403);
        }

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user' => $user->load('role'),
            'token' => $token
        ]);
    }
}
