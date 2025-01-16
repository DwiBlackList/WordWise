<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\v1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class UserController extends Controller
{
    /**
     * User Login.
     *
     * @return AnonymousResourceCollection
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate();
                $user = Auth::user();
                $token = $user->createToken('API Token')->plainTextToken;


                return response()->json([
                    'message' => 'Login successful',
                    'user' => $user,
                    'token' => $token,
                ]);
            }
            Log::info('User login attempt', ['email' => $request->input('email')]);
Log::info('Generated token', ['token' => $token ?? 'No token generated']);


            return response()->json(['message' => 'Invalid credentials'], 401);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred during login'], 500);
        }
    }

    /**
     * Display a listing of the User.
     *
     * @return AnonymousResourceCollection
     */
    // public function index(): AnonymousResourceCollection
    // {
    //     return UserResource::collection(User::all());
    // }

    /**
     * Store a newly created user in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    // public function store(Request $request): JsonResponse
    // {
    //     $request->validate([
    //         'name' => ['required', 'string', 'max:255'],
    //         'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
    //         'password' => ['required', 'confirmed', Rules\Password::defaults()],
    //         'school' => ['required', 'string', 'max:255'],
    //     ]);

    //     $user = User::create([
    //         'name' => $request->input('name'),
    //         'email' => $request->input('email'),
    //         'password' => Hash::make($request->input('password')),
    //         'school' => $request->input('school'),
    //         'role' => 'student',
    //     ]);

    //     return response()->json([
    //         'message' => 'User created successfully',
    //         'data' => new UserResource($user)
    //     ], 201);
    // }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return UserResource
     */
    public function show($id): UserResource
    {
        $user = User::findOrFail($id);

        return new UserResource($user);
    }

    /**
     * Update the specified user in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'school' => ['required', 'string', 'max:255'],
        ]);

        $user->name = $validated['name'];
        $user->school = $validated['school'];
        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'data' => new UserResource($user)
        ]);
    }

    /**
     * Update the specified user in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function updatepass(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'data' => new UserResource($user)
        ]);
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    // public function destroy($id): JsonResponse
    // {
    //     $user = User::findOrFail($id);
    //     $user->delete();

    //     return response()->json([
    //         'message' => 'User deleted successfully'
    //     ]);
    // }
}
