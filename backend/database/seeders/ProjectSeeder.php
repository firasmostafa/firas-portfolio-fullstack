<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        // Firas Portfolio
        Project::create([
            'title' => 'Firas Portfolio',

            'description' =>
                'A full-stack personal portfolio built with React, Laravel, and MySQL to showcase projects, skills, and contact information.',

            'image' => 'portfolio.png',

            'github_url' =>
                'https://github.com/firasmostafa/firas-portfolio-fullstack',

            'live_url' => null,

            'technologies' =>
                'React, Laravel, MySQL, JavaScript, Vite',
        ]);


        // Little Lemon
        Project::create([
            'title' => 'Little Lemon',

            'description' =>
                'A responsive restaurant web application featuring table booking, menu pages, ordering features, and a modern React user interface.',

            'image' => 'little-lemon.png',

            'github_url' =>
                'https://github.com/firasmostafa/Little-limon',

            'live_url' => null,

            'technologies' =>
                'React, JavaScript, CSS, React Router',
        ]);


        // Cedar Table
        Project::create([
            'title' => 'Cedar Table',

            'description' =>
                'A full-stack restaurant web application with a modern responsive interface, ordering features, and back-end data management.',

            'image' => 'cedar-table.png',

            'github_url' =>
                'https://github.com/firasmostafa/cedar-table-fullstack',

            'live_url' => null,

            'technologies' =>
                'React, Laravel, MySQL, JavaScript',
        ]);
    }
}
