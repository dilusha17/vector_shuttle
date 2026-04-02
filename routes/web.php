<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Index'))->name('home');
Route::get('/about', fn () => Inertia::render('About'))->name('about');
Route::get('/services', fn () => Inertia::render('Services'))->name('services');
Route::get('/contact', fn () => Inertia::render('Contact'))->name('contact');

Route::post('/contact/send', [ContactController::class, 'send'])->name('contact.send');
Route::post('/booking/store', [BookingController::class, 'store'])->name('booking.store');

Route::fallback(function (Request $request) {
    return Inertia::render('NotFound')
        ->toResponse($request)
        ->setStatusCode(404);
});

