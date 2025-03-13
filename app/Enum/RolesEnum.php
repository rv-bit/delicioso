<?php

namespace App\Enum;

enum RolesEnum: string
{
    case Admin = 'admin';
    case Customer = 'customer';

    public static function labels(): array
    {
        return [
            self::Admin->value => 'Admin',
            self::Customer->value => 'Customer',
        ];
    }

    public function label()
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Customer => 'Customer',
        };
    }
}
