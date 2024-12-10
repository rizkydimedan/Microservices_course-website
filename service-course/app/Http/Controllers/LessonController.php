<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $lessons = Lesson::query();

        $chapterId = $request->query('chapter_id');
        $lessons->when($chapterId, function ($query) use ($chapterId) {
            return $query->where('chapter_id', $chapterId);
        });

        return response()->json([
            'status' => 'success',
            'data' => $lessons->get()
        ], 200);
    }

    public function show($id)
    {
        $lessons = Lesson::find($id);
        if (!$lessons) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lesson not found'
            ], 404);
        }
        return response()->json([
            'status' => 'success',
            'data' => $lessons
        ], 200);
    }

    public function create(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'video' => 'required|string',
            'chapter_id' => 'required|integer'
        ];

        $data = $request->all();
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 422);
        }

        $chapterId = $request->input('chapter_id');
        $chapter = Chapter::find($chapterId);
        if (!$chapter) {
            return response()->json(['error' => 'Chapter not found'], 404);
        }

        $lesson = Lesson::create($data);
        return response()->json(['message' => 'Lesson created successfully', 'data' => $lesson], 201);
    }

    public function update(Request $request, $id)
    {
        $rules = [
            'name' => 'string',
            'video' => 'string',
            'chapter_id' => 'integer'
        ];

        $data = $request->all();
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 422);
        }

        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['error' => 'Lesson not found'], 404);
        }

        $chapterId = $request->input('chapter_id');
        if ($chapterId) {
            $chapter = Chapter::find($chapterId);
            if (!$chapter) {
                return response()->json(['error' => 'Chapter not found'], 404);
            }
        }
        $lesson->update($data);
        return response()->json(
            ['message' => 'Lesson updated successfully', 'data' => $lesson],
            200
        );
    }

    public function destroy($id)
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['error' => 'Lesson not found'], 404);
        }
        $lesson->delete();
        return response()->json(['message' => 'Lesson deleted successfully'], 200);
    }
}
