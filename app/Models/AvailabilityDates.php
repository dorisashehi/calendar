<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AvailabilityDates extends Model
{
    use HasFactory;

    protected $table = 'availability_dates';

    protected $primaryKey = 'id';

    protected $fillable = ['id', 'user_id', 'date', 'available'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
