<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    protected $guarded = ['id'];

    public const VENDOR = 'vendor';
    public const GUEST = 'guest';

    public const MEAL = 'Meal';
    public const SAVE = 'Save';
}
