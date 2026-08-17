<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;

class ProjectController extends Controller
{
    /**
     * Get Firestore database.
     */
    private function firestore()
    {
        return Firebase::firestore()->database();
    }

    /**
     * Display all projects.
     */
    public function index()
    {
        $documents = $this->firestore()
            ->collection('projects')
            ->documents();

        $projects = [];

        foreach ($documents as $document) {
            if ($document->exists()) {
                $projects[] = [
                    'id' => $document->id(),
                    ...$document->data(),
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Store a new project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string|max:1000',
            'github_url' => 'nullable|url|max:1000',
            'live_url' => 'nullable|url|max:1000',
            'technologies' => 'nullable|string|max:1000',
        ]);

        $document = $this->firestore()
            ->collection('projects')
            ->newDocument();

        $document->set([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_url' => $validated['image_url'] ?? '',
            'github_url' => $validated['github_url'] ?? '',
            'live_url' => $validated['live_url'] ?? '',
            'technologies' => $validated['technologies'] ?? '',
            'created_at' => now()->toIso8601String(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data' => [
                'id' => $document->id(),
                ...$validated,
            ],
        ], 201);
    }

    /**
     * Display one project.
     */
    public function show(string $id)
    {
        $document = $this->firestore()
            ->collection('projects')
            ->document($id)
            ->snapshot();

        if (!$document->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $document->id(),
                ...$document->data(),
            ],
        ]);
    }

    /**
     * Update a project.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image_url' => 'nullable|string|max:1000',
            'github_url' => 'nullable|url|max:1000',
            'live_url' => 'nullable|url|max:1000',
            'technologies' => 'nullable|string|max:1000',
        ]);

        $document = $this->firestore()
            ->collection('projects')
            ->document($id);

        $snapshot = $document->snapshot();

        if (!$snapshot->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found.',
            ], 404);
        }

        $validated['updated_at'] = now()->toIso8601String();

        $document->set($validated, [
            'merge' => true,
        ]);

        $updated = $document->snapshot();

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data' => [
                'id' => $updated->id(),
                ...$updated->data(),
            ],
        ]);
    }

    /**
     * Delete a project.
     */
    public function destroy(string $id)
    {
        $document = $this->firestore()
            ->collection('projects')
            ->document($id);

        $snapshot = $document->snapshot();

        if (!$snapshot->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found.',
            ], 404);
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
        ]);
    }
}
