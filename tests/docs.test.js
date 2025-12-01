import { describe, it, expect, vi } from 'vitest';
import App from '../src/core/app.js';

vi.mock('../src/core/server.js', () => ({
    default: () => ({
        listen: (port, cb) => cb && cb()
    })
}));

describe('Auto-generated Documentation', () => {
    it('should generate markdown for registered routes', () => {
        const app = new App();

        app.get('/users', () => { });
        app.post('/users', () => { });
        app.get('/users/:id', () => { });
        app.put('/files/*', () => { });

        const markdown = app.generateDocs({ title: 'Test API' });

        expect(markdown).toContain('# Test API');
        expect(markdown).toContain('### GET `/users`');
        expect(markdown).toContain('### POST `/users`');
        expect(markdown).toContain('### GET `/users/:id`');
        expect(markdown).toContain('### PUT `/files/*`');

        // Check parameters
        expect(markdown).toContain('`id`: URL Parameter');
        expect(markdown).toContain('_No URL parameters._');
    });

    it('should handle empty routes', () => {
        const app = new App();
        const markdown = app.generateDocs();
        expect(markdown).toContain('_No routes defined._');
    });
});
