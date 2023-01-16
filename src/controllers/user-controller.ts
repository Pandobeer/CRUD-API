import { v4 as uuidv4, validate } from 'uuid';

import { User } from './../user-inteface';
import { getRequestBody } from './../helpers';
import { usersDB } from '../users';

//get All Users
export const getUsers = async (_req: any, res: any) => {
    try {
        res.writeHead(200, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ usersDB, message: 'You got all users' }));
    } catch (err: any) {
        res.writeHead(500, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Can not get users' }));
    }
};

//get User by Id
export const getUser = async (req: any, res: any) => {
    try {
        const userId = req.url?.split('/')[3];

        if (!validate(userId)) {
            res.writeHead(400, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User id is invalid' }));
        }

        const user = usersDB.find((user) => user.id === userId);

        if (!user) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User does not exist' }));
        }

        res.writeHead(200, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ user, message: 'User and information about the User' }));

    } catch (err: any) {
        res.writeHead(404, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'User with this ID does not exist' }));
    }
};

//create new User
export const createUser = async (req: any, res: any) => {
    try {
        const body = await getRequestBody(req);

        const user = JSON.parse(body) as User;

        const { username, age, hobbies } = user;

        if (!username || !age || !hobbies) {
            res.writeHead(400, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({
                message: 'User body does not contain required fields'
            }));
        }

        const newUser = {
            id: uuidv4(),
            username,
            age,
            hobbies
        };

        usersDB.push(newUser);

        res.on('close', () => {
            process.send?.(usersDB);
        });

        res.writeHead(201, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ newUser, message: 'You created new User' }));
    } catch (err: any) {
        res.writeHead(500, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: err.message }));
    }
};

//Delete user
//DELETE /api/users/id
export const deleteUser = async (req: any, res: any) => {
    try {
        const userId = req.url?.split('/')[3];

        const indexOfUserToDelete = usersDB.findIndex((user) => userId === user.id);

        if (!validate(userId)) {
            res.writeHead(400, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User id is invalid' }));
        }

        if (indexOfUserToDelete < 0) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User does not exist' }));
        }

        usersDB.splice(indexOfUserToDelete, 1);

        res.on('close', () => {
            process.send?.(usersDB);
        });

        res.writeHead(204, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: `User was successfully deleted` }));

    } catch (err: any) {
        res.writeHead(404, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'User does not exist' }));
    }
};

//UPDATE /api/users/id

export const updateUser = async (req: any, res: any) => {
    try {
        const userId = req.url?.split('/')[3];

        const indexOfUserToUpdate = usersDB.findIndex((user) => userId === user.id);

        if (!validate(userId)) {
            res.writeHead(400, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User id is invalid' }));
        }

        if (indexOfUserToUpdate < 0) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User does not exist' }));
        }

        const body = await getRequestBody(req);
        const user = JSON.parse(body) as User;

        const { username, age, hobbies } = user;

        if (username) {
            usersDB[indexOfUserToUpdate].username = username;
        }

        if (age) {
            usersDB[indexOfUserToUpdate].age = age;
        }

        if (hobbies) {
            usersDB[indexOfUserToUpdate].hobbies = hobbies;
        }

        res.on('close', () => {
            process.send?.(usersDB);
        });

        res.writeHead(200, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: `User with ${userId} was updated` }));

    } catch (error) {
        res.writeHead(404, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'User does not exist' }));
    }
};