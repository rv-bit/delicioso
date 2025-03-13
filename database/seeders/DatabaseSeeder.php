<?php

namespace Database\Seeders;

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Models\User;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $customerRole = Role::create(['name' => RolesEnum::Customer->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);

        $managePricesPermission = Permission::create([
            'name' => PermissionsEnum::ManagePrices->value,
        ]);
        $manageItemsPermission = Permission::create([
            'name' => PermissionsEnum::ManageItems->value,
        ]);
        $manageUsersPermission = Permission::create([
            'name' => PermissionsEnum::ManageUsers->value,
        ]);

        $adminRole->syncPermissions([
            $managePricesPermission,
            $manageUsersPermission,
            $manageItemsPermission
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ])->assignRole(RolesEnum::Admin);
    }
}
