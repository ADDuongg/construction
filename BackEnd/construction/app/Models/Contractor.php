<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Contractor extends Model
{
    use HasFactory, HasApiTokens;


    protected $table = 'nhathau';
    protected $primaryKey = 'nhathau_id';
    protected $fillable = [
        'tennhathau',
        'diachi',
        'sdt',
        'email',
        'loaihinhhoatdong'
    ];
}
