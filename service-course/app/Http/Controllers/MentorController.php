<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MentorController extends Controller
{

    public function index(Request $request)
    {
        $mentors = Mentor::all();
        return response()->json([
            'status' => 200,
            'data' => $mentors
        ]);
    }

    public function show($id)
    {
        $mentor = Mentor::find($id);
        if (!$mentor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mentor not found'
            ], 400);
        }

        return response()->json([
            'status' => 'suuccess',
            'data' => $mentor
        ]);
    }

    public function create(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'profile' => 'required|url',
            'email' => 'required|email',
            'profession' => 'required|string'

        ];

        $data = $request->all();

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $mentor = Mentor::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $mentor
        ]);
    }


    public function update(Request $request, $id)
    {
        $rules = [
            'name' => 'string',
            'profile' => 'url',
            'email' => 'email',
            'profession' => 'string'

        ];

        $data = $request->all();

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $mentor = Mentor::find($id);
        if (!$mentor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mentor not found',
            ], 404);
        }

        $mentor->fill($data);
        $mentor->save();
        return response()->json([
            'status' => 'success',
            'data' => $mentor
        ]);
    }

    public function destroy($id)
    {
        $mentor = Mentor::find($id);
        if (!$mentor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mentor not found',
            ], 404);
        }
        $mentor->delete();
        return response()->json([
            'status' => 'success',
            'messages' => 'Mentor succesfully deleted'
        ]);
    }
}
