import { v4 as uuidv4, validate } from 'uuid';

import { User, UserWithId } from './../user-inteface';
import { getRequestBody } from './../helpers';

const users: UserWithId[] = [];

//get All Users
export const getUsers = async (_req: any, res: any) => {
    try {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ users, message: 'You got all users' }));
    } catch (err: any) {
        res.writeHead(500, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: 'Can not get userss' }));
    }
};

//get User by Id
export const getUser = async (req: any, res: any) => {
    try {
        const userId = req.url?.split('/')[3];

        if (!validate(userId)) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({ message: 'User id is invalid' }));

        }
        const user = users.find((user) => user.id === userId);

        if (!user) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({ message: 'User does not exist' }));
        }

        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ user, message: 'User and information about the User' }));

    } catch (err: any) {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: 'User with this ID does not exist' }));
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
            res.end(JSON.stringify({
                message: 'User body does not contain required fields'
            }));
        }

        const newUser = {
            id: uuidv4(),
            username,
            age,
            hobbies
        };

        users.push(newUser);

        res.writeHead(201, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ newUser, message: 'You created new User' }));
    } catch (err: any) {
        res.writeHead(500, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
};