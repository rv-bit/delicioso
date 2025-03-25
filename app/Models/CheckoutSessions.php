<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class CheckoutSessions extends Model
{
    use HasFactory;

    protected $table = 'checkout_sessions';
    protected $fillable = [
        'stripe_session_id',
        'paid',
    ];
}
