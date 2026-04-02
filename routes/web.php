<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public Routes ────────────────────────────────────────────────────────────
Route::get('/', fn () => Inertia::render('Index'))->name('home');
Route::get('/about', fn () => Inertia::render('About'))->name('about');
Route::get('/services', fn () => Inertia::render('Services'))->name('services');
Route::get('/contact', fn () => Inertia::render('Contact'))->name('contact');

Route::post('/contact/send', [ContactController::class, 'send'])->name('contact.send');
Route::post('/booking/store', [BookingController::class, 'store'])->name('booking.store');

// ─── Admin Routes ─────────────────────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->group(function () {

    // Redirect /admin → login or dashboard
    Route::get('/', fn () => redirect()->route('admin.dashboard'));

    // Guest-only (redirect to dashboard if already authenticated admin)
    Route::get('/login', [Admin\AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [Admin\AuthController::class, 'login'])->name('login.post');

    // Protected admin routes
    Route::middleware('admin')->group(function () {
        Route::post('/logout', [Admin\AuthController::class, 'logout'])->name('logout');

        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // Bookings
        Route::prefix('bookings')->name('bookings.')->group(function () {
            Route::get('/', [Admin\BookingController::class, 'index'])->name('index');
            Route::get('/{booking}', [Admin\BookingController::class, 'show'])->name('show');
            Route::post('/{booking}/accept', [Admin\BookingController::class, 'accept'])->name('accept');
            Route::post('/{booking}/reject', [Admin\BookingController::class, 'reject'])->name('reject');
            Route::post('/{booking}/confirm', [Admin\BookingController::class, 'confirm'])->name('confirm');
            Route::post('/{booking}/start', [Admin\BookingController::class, 'start'])->name('start');
            Route::post('/{booking}/complete', [Admin\BookingController::class, 'complete'])->name('complete');
        });

        // Users (admin-only enforced inside controller)
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [Admin\UserController::class, 'index'])->name('index');
            Route::post('/', [Admin\UserController::class, 'store'])->name('store');
            Route::put('/{user}', [Admin\UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [Admin\UserController::class, 'destroy'])->name('destroy');
        });

        // Profile
        Route::get('/profile', [Admin\ProfileController::class, 'edit'])->name('profile');
        Route::put('/profile', [Admin\ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [Admin\ProfileController::class, 'updatePassword'])->name('profile.password');
    });
});

Route::fallback(function (Request $request) {
    return Inertia::render('NotFound')
        ->toResponse($request)
        ->setStatusCode(404);
});

