<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Request as RequestModel;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use HasRoles;
    use TwoFactorAuthenticatable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'hris_id',
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'position',
        'contact_no',
        'employment_status',
        'office_id',
        'position_id',
        'email',
        'password',
        'account_status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
        'full_name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the default profile photo URL if no profile photo has been uploaded.
     *
     * @return string
     */
    protected function defaultProfilePhotoUrl()
    {
        // If the user has a profile photo path, return its full URL
        if ($this->profile_photo_path) {
            return asset('storage/' . $this->profile_photo_path); //remember to set port in .env in APP_URL
        }

        // Otherwise, generate initials from first and last name
        $name = trim(collect(explode(' ', $this->first_name . ' ' . $this->last_name))
            ->map(fn($segment) => mb_substr($segment, 0, 1))
            ->join(' '));

        return 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&color=7F9CF5&background=EBF4FF&format=svg';
    }


    public function requests()
    {
        return $this->hasMany(RequestModel::class, 'created_by');
    }

    public function getFullNameAttribute(): string
    {
        $names = [$this->first_name];

        if ($this->middle_name) {
            $names[] = $this->middle_name;
        }

        $names[] = $this->last_name;

        return implode(' ', $names);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}
