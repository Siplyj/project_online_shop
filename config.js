const isLocal = import.meta.env.VITE_IS_LOCAL === 'true';

console.log(`local: ${isLocal}`);

export const BACKEND_URL = isLocal ? 'http://localhost:3000' : import.meta.env.VITE_API_URL;