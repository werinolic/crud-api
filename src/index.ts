import http from 'node:http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import users from './utils/db.js';
import { User } from './models/user.js';
import dotenv from 'dotenv';
import { URL } from 'node:url';

dotenv.config();

const PORT = process.env.PORT || 3000;

export function createServer() {
    return http.createServer((req, res) => {
        const { method, url } = req;
        const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;

        let trimmedPathname = pathname.replace(/\/$/, '');

        if (trimmedPathname === '/api/users') {
            if (method === 'GET') {
                handleGetUsers(req, res);
            } else if (method === 'POST') {
                handleCreateUser(req, res);
            } else {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Method Not Allowed' }));
            }
        } else if (trimmedPathname.startsWith('/api/users/')) {
            const id = trimmedPathname.replace('/api/users/', '');

            if (!uuidValidate(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid UUID' }));
                return;
            }

            if (method === 'GET') {
                handleGetUserById(req, res, id);
            } else if (method === 'PUT') {
                handleUpdateUser(req, res, id);
            } else if (method === 'DELETE') {
                handleDeleteUser(req, res, id);
            } else {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Method Not Allowed' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Endpoint Not Found' }));
        }
    });
}

function handleGetUsers(req: http.IncomingMessage, res: http.ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

function handleGetUserById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
) {
    const user = users.find((u) => u.id === id);
    if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User Not Found' }));
    }
}

function handleCreateUser(
    req: http.IncomingMessage,
    res: http.ServerResponse
) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const { username, age, hobbies } = data;
            if (
                typeof username === 'string' &&
                typeof age === 'number' &&
                Array.isArray(hobbies)
            ) {
                const newUser: User = {
                    id: uuidv4(),
                    username,
                    age,
                    hobbies,
                };
                users.push(newUser);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid user data' }));
            }
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
    });
}

function handleUpdateUser(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
) {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User Not Found' }));
        return;
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const { username, age, hobbies } = data;
            if (
                typeof username === 'string' &&
                typeof age === 'number' &&
                Array.isArray(hobbies)
            ) {
                const updatedUser: User = {
                    id,
                    username,
                    age,
                    hobbies,
                };
                users[userIndex] = updatedUser;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedUser));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid user data' }));
            }
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
    });
}


function handleDeleteUser(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
) {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User Not Found' }));
        return;
    }

    users.splice(userIndex, 1);
    res.writeHead(204);
    res.end();
}

const server = createServer();
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
