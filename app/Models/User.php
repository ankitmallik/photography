<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'deleted_at' => 'datetime',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPhotographer(): bool
    {
        return $this->role === 'photographer';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function customerProfile(): HasOne
    {
        return $this->hasOne(CustomerProfile::class);
    }

    public function photographerProfile(): HasOne
    {
        return $this->hasOne(PhotographerProfile::class);
    }

    public function customerBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'customer_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'customer_id');
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'customer_id');
    }
}
