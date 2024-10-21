import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user';
import users from '../utils/db';

export function getAllUsers(): User[] {
    return users;
}

export function getUserById(id: string): User | undefined {
    return users.find((user) => user.id === id);
}

export function createUser(data: Omit<User, 'id'>): User {
    const newUser: User = { id: uuidv4(), ...data };
    users.push(newUser);
    return newUser;
}

export function updateUser(
    id: string,
    data: Omit<User, 'id'>
): User | null {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        const updatedUser: User = { id, ...data };
        users[index] = updatedUser;
        return updatedUser;
    } else {
        return null;
    }
}

export function deleteUser(id: string): boolean {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        return true;
    } else {
        return false;
    }
}
