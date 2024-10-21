import http from 'node:http';
import { URL } from 'node:url';
import { validate as uuidValidate } from 'uuid';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from './services/userService';
import {httpMethods} from "./models/http";

const contentTypeHeader = { 'Content-Type': 'application/json' };

export function router(req: http.IncomingMessage, res: http.ServerResponse) {
    const { method } = req;
    const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    const trimmedPathname = pathname.replace(/\/$/, '');

    if (trimmedPathname === '/api/users') {
        if (method === httpMethods.GET) {
            handleGetUsers(req, res);
        } else if (method === httpMethods.POST) {
            handleCreateUser(req, res);
        } else {
            res.writeHead(405, contentTypeHeader);
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        }
    } else if (trimmedPathname.startsWith('/api/users/')) {
        const id = trimmedPathname.replace('/api/users/', '');

        if (!uuidValidate(id)) {
            res.writeHead(400, contentTypeHeader);
            res.end(JSON.stringify({ message: 'Invalid UUID' }));
            return;
        }

        if (method === httpMethods.GET) {
            handleGetUserById(req, res, id);
        } else if (method === httpMethods.PUT) {
            handleUpdateUser(req, res, id);
        } else if (method === httpMethods.DELETE) {
            handleDeleteUser(req, res, id);
        } else {
            res.writeHead(405, contentTypeHeader);
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        }
    } else {
        res.writeHead(404, contentTypeHeader);
        res.end(JSON.stringify({ message: 'Endpoint Not Found' }));
    }
}

function handleGetUsers(req: http.IncomingMessage, res: http.ServerResponse) {
    const users = getAllUsers();
    res.writeHead(200, contentTypeHeader);
    res.end(JSON.stringify(users));
}

function handleGetUserById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
) {
    const user = getUserById(id);
    if (user) {
        res.writeHead(200, contentTypeHeader);
        res.end(JSON.stringify(user));
    } else {
        res.writeHead(404, contentTypeHeader);
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
                const newUser = createUser({ username, age, hobbies });
                res.writeHead(201, contentTypeHeader);
                res.end(JSON.stringify(newUser));
            } else {
                res.writeHead(400, contentTypeHeader);
                res.end(JSON.stringify({ message: 'Invalid user data' }));
            }
        } catch (err) {
            res.writeHead(400, contentTypeHeader);
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
    });
}

function handleUpdateUser(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
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
                const updatedUser = updateUser(id, { username, age, hobbies });
                if (updatedUser) {
                    res.writeHead(200, contentTypeHeader);
                    res.end(JSON.stringify(updatedUser));
                } else {
                    res.writeHead(404, contentTypeHeader);
                    res.end(JSON.stringify({ message: 'User Not Found' }));
                }
            } else {
                res.writeHead(400, contentTypeHeader);
                res.end(JSON.stringify({ message: 'Invalid user data' }));
            }
        } catch (err) {
            res.writeHead(400, contentTypeHeader);
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
    });
}

function handleDeleteUser(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
) {
    const isDeleted = deleteUser(id);
    if (isDeleted) {
        res.writeHead(204);
        res.end();
    } else {
        res.writeHead(404, contentTypeHeader);
        res.end(JSON.stringify({ message: 'User Not Found' }));
    }
}
