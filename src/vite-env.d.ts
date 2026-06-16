/// <reference types="vite/client" />

// Image module declarations — let TS know that `import x from './foo.png'`
// resolves to a string URL (Vite's default behaviour for static assets).
declare module "*.png" { const src: string; export default src; }
declare module "*.jpg" { const src: string; export default src; }
declare module "*.jpeg" { const src: string; export default src; }
declare module "*.webp" { const src: string; export default src; }
declare module "*.svg" { const src: string; export default src; }
declare module "*.avif" { const src: string; export default src; }
