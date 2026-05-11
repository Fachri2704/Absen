<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'name',
        'level',
        'major',
    ];

    public function students(){
        return $this->hasMany(Student::class, 'class_id');
    }
}
