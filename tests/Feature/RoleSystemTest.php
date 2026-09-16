<?php

namespace Tests\Feature;

use App\Models\Buyer;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleSystemTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_roles_are_limited_to_admin_and_manager(): void
    {
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);

        $this->assertDatabaseHas('roles', ['name' => 'admin', 'guard_name' => 'web']);
        $this->assertDatabaseHas('roles', ['name' => 'manager', 'guard_name' => 'web']);

        $invalidRoles = ['buyer', 'seller'];
        foreach ($invalidRoles as $invalidRole) {
            $this->assertDatabaseMissing('roles', ['name' => $invalidRole]);
        }
    }

    public function test_user_buyer_and_seller_support_soft_deletes(): void
    {
        $user = User::factory()->create();
        $user->delete();
        $this->assertNotNull($user->deleted_at);

        $buyer = Buyer::create([
            'name' => 'Sample Buyer',
            'email' => 'buyer@example.com',
            'contact_number' => '9999999999',
            'address' => 'Hyderabad',
        ]);
        $buyer->delete();
        $this->assertNotNull($buyer->deleted_at);

        $seller = Seller::create([
            'name' => 'Sample Seller',
            'email' => 'seller@example.com',
            'contact_number' => '8888888888',
            'address' => 'Banjara Hills',
        ]);
        $seller->delete();
        $this->assertNotNull($seller->deleted_at);
    }

    public function test_users_store_address_and_contact_number(): void
    {
        $user = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => 'secret123',
            'status' => 1,
            'address' => 'Banjara Hills, Hyderabad',
            'contact_number' => '+91 98765 43210',
        ]);

        $this->assertSame('Banjara Hills, Hyderabad', $user->address);
        $this->assertSame('+91 98765 43210', $user->contact_number);
        $this->assertDatabaseHas('users', ['email' => 'manager@example.com']);
    }
}
