<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('photographers')->orderBy('sort_order')->get();

        return Inertia::render('Admin/Categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|numeric',
        ]);

        $data['slug'] = Str::slug($data['name']);

        Category::create($data);

        return back()->with('success', 'Category created successfully!');
    }

    public function update(Request $request, int $id)
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|numeric',
        ]);

        $category->update($data);

        return back()->with('success', 'Category updated successfully!');
    }

    public function destroy(int $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Category deleted successfully!');
    }
}
