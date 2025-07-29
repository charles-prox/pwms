<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Writer;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use Laravel\Fortify\RecoveryCode;
use Illuminate\Support\Facades\Crypt;

class TwoFactorController extends Controller
{
    protected Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Initiate 2FA setup by generating a temporary secret and QR code.
     */
    public function initiate(Request $request)
    {
        $user = $request->user();

        if ($user->two_factor_secret) {
            return response()->json(['message' => '2FA is already enabled.'], 409);
        }

        $secret = $this->google2fa->generateSecretKey();
        session(['2fa_secret' => $secret]);

        $qrSvg = $this->generateQrSvg(
            $this->google2fa->getQRCodeUrl(
                config('app.name'),
                $user->email ?? $user->hris_id,
                $secret
            )
        );

        return response()->json([
            'qr_svg' => $qrSvg,
            'secret' => $secret,
        ]);
    }

    /**
     * Verify the 2FA code and enable 2FA for the user.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();
        $secret = session('2fa_secret');

        if (!$secret) {
            return response()->json(['message' => '2FA setup not initiated.'], 400);
        }

        if (! $this->google2fa->verifyKey($secret, $request->input('code'))) {
            return response()->json(['message' => 'Invalid verification code.'], 422);
        }

        $user->forceFill([
            'two_factor_secret' => Crypt::encrypt(
                $secret
            ),
            'two_factor_recovery_codes' => encrypt(json_encode(
                collect(range(1, 8))->map(fn() => RecoveryCode::generate())->all()
            )),
            'two_factor_confirmed_at' => now(),
        ])->save();

        session()->forget('2fa_secret');

        return response()->json(['message' => '2FA has been enabled.']);
    }

    /**
     * Disable 2FA for the authenticated user.
     */
    public function destroy(Request $request)
    {
        $request->user()->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
        ])->save();

        return response()->json(['message' => '2FA has been disabled.']);
    }

    /**
     * Return a fresh QR code for users who already have 2FA enabled.
     */
    public function showQrCode(Request $request)
    {
        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json(['message' => '2FA is not enabled.'], 404);
        }

        $secret = decrypt($user->two_factor_secret);
        $qrSvg = $this->generateQrSvg(
            $this->google2fa->getQRCodeUrl(
                config('app.name'),
                $user->email ?? $user->hris_id,
                $secret
            )
        );

        return response($qrSvg)->header('Content-Type', 'image/svg+xml');
    }

    /**
     * Return the decrypted recovery codes.
     */
    public function showRecoveryCodes(Request $request)
    {
        $user = $request->user();

        if (!$user->two_factor_recovery_codes) {
            return response()->json(['message' => 'No recovery codes available.'], 404);
        }

        return response()->json(json_decode(decrypt($user->two_factor_recovery_codes), true));
    }

    /**
     * Generate SVG QR code from a given URL.
     */
    protected function generateQrSvg(string $qrUrl): string
    {
        $writer = new Writer(
            new ImageRenderer(
                new RendererStyle(200),
                new SvgImageBackEnd()
            )
        );

        return $writer->writeString($qrUrl);
    }
}
