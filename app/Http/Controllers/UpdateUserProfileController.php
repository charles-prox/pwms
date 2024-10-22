<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\ProfileInformationUpdatedResponse;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Controllers\ProfileInformationController;

class UpdateUserProfileController extends ProfileInformationController
{
    /**
     * Update the user's profile information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Laravel\Fortify\Contracts\UpdatesUserProfileInformation  $updater
     * @return \Laravel\Fortify\Contracts\ProfileInformationUpdatedResponse
     */
    public function update(
        Request $request,
        UpdatesUserProfileInformation $updater
    ) {

        // dd($request->all());
        if (config('fortify.lowercase_usernames')) {
            $request->merge([
                Fortify::username() => Str::lower($request->{Fortify::username()}),
            ]);
        }

        $updater->update($request->user(), $request->all());

        return app(ProfileInformationUpdatedResponse::class);
    }
}
