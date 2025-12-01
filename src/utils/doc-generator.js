export function generateMarkdown(routes, options = {}) {
    const title = options.title || 'API Documentation';
    const description = options.description || 'Automatically generated API documentation.';

    let md = `# ${title}\n\n`;
    md += `${description}\n\n`;
    md += `## Endpoints\n\n`;

    if (!routes || routes.length === 0) {
        md += '_No routes defined._\n';
        return md;
    }

    const sortedRoutes = [...routes].sort((a, b) => {
        return a.path.localeCompare(b.path) || a.method.localeCompare(b.method);
    });

    sortedRoutes.forEach(route => {
        md += `### ${route.method} \`${route.path}\`\n\n`;

        if (route.paramNames && route.paramNames.length > 0) {
            md += `**Parameters:**\n\n`;
            route.paramNames.forEach(param => {
                md += `- \`${param}\`: URL Parameter\n`;
            });
            md += '\n';
        } else {
            md += `_No URL parameters._\n\n`;
        }

        md += `---\n\n`;
    });

    return md;
}
