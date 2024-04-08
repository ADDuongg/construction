<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use App\Models\MatterialStatistic;
class Statistic extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'thongkengay';
    protected $primaryKey = 'thongkengay_id';
    protected $fillable = [
        'duan_id',
        'giaidoan_duan_id',
        'ghichu',
        'nhanvien_id',
        'ngaythongke',
    ];
    public function matterialStatistic()
    {
        return $this->hasMany(MatterialStatistic::class);
    }
}
