<?php

namespace App\Enum;

enum CategoriesEnum: string
{
    case SharingBoxes = 'sharing_boxes';
    case Breakfast = 'breakfast';
    case Lunch = 'lunch';
    case SweetsCakes = 'sweets_cakes';

    public static function values(): array
    {
        return [
            self::SharingBoxes->value,
            self::Breakfast->value,
            self::Lunch->value,
            self::SweetsCakes->value,
        ];
    }

    public static function labels(): array
    {
        return [
            self::SharingBoxes->value => 'Sharing Boxes',
            self::Breakfast->value => 'Breakfast',
            self::Lunch->value => 'Lunch',
            self::SweetsCakes->value => 'Sweets & Cakes',
        ];
    }

    public static function images(): array
    {
        return [
            self::SharingBoxes->value => '/media/categories/sharing_collection_image.webp',
            self::Breakfast->value => '/media/categories/breakfast_collection_image.webp',
            self::Lunch->value => '/media/categories/lunch_collection_image.webp',
            self::SweetsCakes->value => '/media/categories/sweets_collection_image.webp',
        ];
    }

    public function label()
    {
        return match ($this) {
            self::SharingBoxes => 'Sharing Boxes',
            self::Breakfast => 'Breakfast',
            self::Lunch => 'Lunch',
            self::SweetsCakes => 'Sweets & Cakes',
        };
    }
}
