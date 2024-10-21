import http from 'node:http';
import dotenv from 'dotenv';
import { router } from './router.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

export function createServer() {
    return http.createServer((req, res) => {
        router(req, res);
    });
}
createServer().listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
