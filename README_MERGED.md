# Merged Laravel 12 + React Frontend Project

This package merges your fresh Laravel 12 project with the React frontend design using:

- Laravel 12 backend
- Inertia.js for routing
- React 18.3.1
- React DOM 18.3.1
- Vite 7.0.0
- @vitejs/plugin-react 5.0.0
- Tailwind CSS v3
- React Router removed
- Browser theme detection removed

## Important

`node_modules`, `vendor`, and lock files were intentionally removed so the merged package stays smaller and can install cleanly from the updated `package.json` and `composer.json`.

## After download

Run these commands inside the project root:

```bash
composer install
npm install
php artisan key:generate
php artisan serve
npm run dev
```

If you are using the provided `.env`, make sure the database settings are correct for your environment before migrating.

## What was merged

- React UI moved into `resources/js`
- React Router replaced with Inertia links/routes
- Laravel root view changed to `resources/views/app.blade.php`
- Laravel routes now render Inertia pages
- Tailwind 4 setup replaced with Tailwind 3 config from the React project
- `next-themes` removed from the UI toast system and fixed to dark mode
