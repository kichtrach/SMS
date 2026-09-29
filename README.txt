Infigo EduSuite Admin

Open index.html directly in Chrome/Edge/Firefox. No local web server is required.

Reusable application shell:
- components/sidebar.html and components/topbar.html remain the readable component templates.
- assets/js/sidebar.js and assets/js/topbar.js render those shared components for file:// compatibility.
- Every inner page uses the same component renderers and data-page controls the active nav item.

For production, you can replace the synchronous template renderer with your framework/server-side include system without changing page markup.
