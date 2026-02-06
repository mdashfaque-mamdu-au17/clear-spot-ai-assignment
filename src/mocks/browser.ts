import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

const sites = Array.from({ length: 50 }, (_, i) => ({
  id: `site-${i + 1}`,
  name: `Green Energy Site ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
  capacity: Math.floor(Math.random() * 350) + 50,
}));

export const handlers = [
  http.get('/api/sites', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 10;
    
    return HttpResponse.json({
      sites: sites.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        total: sites.length,
        totalPages: Math.ceil(sites.length / limit),
      },
    });
  }),
];

export const worker = setupWorker(...handlers);
