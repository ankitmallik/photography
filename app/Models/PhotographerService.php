<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotographerService extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_profile_id',
        'category_id',
        'name',
        'description',
        'price_type',
        'price',
        'max_price',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(PhotographerProfile::class, 'photographer_profile_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
