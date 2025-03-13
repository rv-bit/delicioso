<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    case ManageItems = 'manage_items';
    case ManagePrices = 'manage_prices';
    case ManageUsers = 'manage_users';
}
