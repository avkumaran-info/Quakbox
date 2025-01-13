<?php

use Laravel\Passport\Http\Controllers\AccessTokenController;
use Laravel\Passport\Http\Controllers\AuthorizationController;
use Laravel\Passport\Http\Controllers\ApproveAuthorizationController;
use Laravel\Passport\Http\Controllers\DenyAuthorizationController;
use Laravel\Passport\Http\Controllers\TransientTokenController;

Route::prefix('oauth')->group(function () {
    Route::post('token', [AccessTokenController::class, 'issueToken'])->name('passport.token');
    Route::get('authorize', [AuthorizationController::class, 'authorize'])->name('passport.authorizations.authorize');
    Route::post('approve', [ApproveAuthorizationController::class, 'approve'])->name('passport.authorizations.approve');
    Route::post('deny', [DenyAuthorizationController::class, 'deny'])->name('passport.authorizations.deny');
    Route::post('token/refresh', [TransientTokenController::class, 'refresh'])->name('passport.token.refresh');
});
