import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) {
    // @ts-expect-error ziggy global
    window.route = route;
    createRoot(el).render(
      <>
        <App {...props} />
        <Toaster richColors position="bottom-left" />
      </>
    );
  },
  title: (title) => (title ? `${title} - Vector Shuttle` : 'Vector Shuttle'),
});
