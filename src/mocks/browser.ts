import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock for Part 1.2: Site List
  http.get('/api/sites', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    
    const sites = [
      { id: '1', name: 'Solar Farm Alpha', capacity: 150 },
      { id: '2', name: 'Wind Park Beta', capacity: 200 },
      { id: '3', name: 'Hydro Plant Gamma', capacity: 300 },
      { id: '4', name: 'Battery Storage Delta', capacity: 100 },
      { id: '5', name: 'Solar Array Epsilon', capacity: 50 },
    ];

    return HttpResponse.json({
      sites: sites.slice((page - 1) * 2, page * 2),
      pagination: {
        page,
        total: sites.length,
        totalPages: Math.ceil(sites.length / 2),
      },
    });
  }),

  // Add more handlers as needed
];

export const worker = setupWorker(...handlers);
