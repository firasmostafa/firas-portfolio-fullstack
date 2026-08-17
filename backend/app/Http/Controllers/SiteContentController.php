<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;

class SiteContentController extends Controller
{
    /**
     * Get Firestore database.
     */
    private function firestore()
    {
        return Firebase::firestore()->database();
    }

    /**
     * Default skills used only once.
     */
    private function defaultSkills(): array
    {
        return [
            'React',
            'JavaScript',
            'HTML',
            'CSS',
            'PHP',
            'Laravel',
            'MySQL',
            'Git',
            'GitHub',
            'REST API',
        ];
    }

    /**
     * Merge skills without duplicates.
     */
    private function mergeSkills(array $currentSkills): array
    {
        $skills = $currentSkills;

        foreach ($this->defaultSkills() as $defaultSkill) {
            $exists = false;

            foreach ($skills as $skill) {
                if (
                    strtolower(trim($skill)) ===
                    strtolower($defaultSkill)
                ) {
                    $exists = true;
                    break;
                }
            }

            if (!$exists) {
                $skills[] = $defaultSkill;
            }
        }

        return array_values($skills);
    }

    /**
     * Get site content.
     */
    public function index()
    {
        $document = $this->firestore()
            ->collection('site_content')
            ->document('main');

        $snapshot = $document->snapshot();

        /*
        |--------------------------------------------------------------------------
        | First time ever
        |--------------------------------------------------------------------------
        */

        if (!$snapshot->exists()) {
            $initialData = [
                'name' => 'Firas Mostafa',
                'title' => 'Software Developer',
                'hero_text' => '',
                'profile_image' => '',
                'about' => '',
                'skills' => $this->defaultSkills(),
                'social_links' => [],

                // Prevent default skills from being restored again
                'skills_initialized' => true,

                'created_at' => now()->toIso8601String(),
            ];

            $document->set($initialData);

            return response()->json([
                'success' => true,
                'data' => $initialData,
            ]);
        }

        $data = $snapshot->data();

        /*
        |--------------------------------------------------------------------------
        | Initialize old skills ONE TIME ONLY
        |--------------------------------------------------------------------------
        |
        | Your Firestore document already exists because we tested React
        | and Laravel earlier.
        |
        | Therefore we merge the old default skills once, then save a flag.
        |
        */

        if (!($data['skills_initialized'] ?? false)) {
            $currentSkills = $data['skills'] ?? [];

            if (!is_array($currentSkills)) {
                $currentSkills = [];
            }

            $skills = $this->mergeSkills($currentSkills);

            $document->set([
                'skills' => $skills,
                'skills_initialized' => true,
                'updated_at' => now()->toIso8601String(),
            ], [
                'merge' => true,
            ]);

            $data['skills'] = $skills;
            $data['skills_initialized'] = true;
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Update only the fields sent by the admin.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' =>
                'sometimes|nullable|string|max:255',

            'title' =>
                'sometimes|nullable|string|max:255',

            'hero_text' =>
                'sometimes|nullable|string',

            'profile_image' =>
                'sometimes|nullable|string|max:1000',

            'about' =>
                'sometimes|nullable|string',

            'skills' =>
                'sometimes|nullable|array',

            'skills.*' =>
                'nullable|string|max:255',

            'social_links' =>
                'sometimes|nullable|array',

            'social_links.*.name' =>
                'required|string|max:100',

            'social_links.*.url' =>
                'required|string|max:1000',
        ]);

        $validated['updated_at'] =
            now()->toIso8601String();

        $document = $this->firestore()
            ->collection('site_content')
            ->document('main');

        $document->set(
            $validated,
            [
                'merge' => true,
            ]
        );

        $updated = $document->snapshot();

        return response()->json([
            'success' => true,
            'message' =>
                'Site content updated successfully.',
            'data' => $updated->data(),
        ]);
    }
}
