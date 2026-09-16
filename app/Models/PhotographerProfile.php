<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhotographerProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'business_name',
        'display_name',
        'slug',
        'tagline',
        'bio',
        'experience_years',
        'profile_image',
        'cover_image',
        'address',
        'city',
        'state',
        'pincode',
        'latitude',
        'longitude',
        'verification_status',
        'rejection_reason',
        'profile_status',
        'is_featured',
        'featured_until',
        'starting_price',
        'max_price',
        'average_rating',
        'review_count',
        'total_bookings',
        'completion_percentage',
        'social_links',
    ];

    protected $casts = [
        'experience_years' => 'integer',
        'is_featured' => 'boolean',
        'featured_until' => 'date',
        'starting_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'review_count' => 'integer',
        'total_bookings' => 'integer',
        'completion_percentage' => 'integer',
        'social_links' => 'array',
        'deleted_at' => 'datetime',
    ];

    // Scopes for Public Visibility
    public function scopePubliclyVisible(Builder $query): Builder
    {
        return $query->where('verification_status', 'approved')
                     ->where('profile_status', 'active');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_photographer');
    }

    public function locations(): HasMany
    {
        return $this->hasMany(PhotographerLocation::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(PhotographerService::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(PhotographerPackage::class);
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(PhotographerAvailability::class);
    }

    public function bankAccounts(): HasMany
    {
        return $this->hasMany(PhotographerBankAccount::class);
    }

    public function primaryBankAccount(): HasOne
    {
        return $this->hasOne(PhotographerBankAccount::class)->where('is_primary', true);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(PhotographerEarning::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function recalculateProfileCompletion(): int
    {
        $score = 20; // Base info
        if ($this->bio && strlen($this->bio) > 30) $score += 15;
        if ($this->profile_image) $score += 10;
        if ($this->cover_image) $score += 10;
        if ($this->services()->count() > 0) $score += 15;
        if ($this->packages()->count() > 0) $score += 15;
        if ($this->portfolios()->count() > 0) $score += 10;
        if ($this->bankAccounts()->count() > 0) $score += 5;

        $this->completion_percentage = min(100, $score);
        $this->save();

        return $this->completion_percentage;
    }
}
