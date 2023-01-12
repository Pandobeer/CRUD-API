import { User, UserWithId } from './../user-inteface';
import { getRequestBody } from './../helpers';
import { v4 as uuidv4 } from 'uuid';

const users: UserWithId[] = [];

//get All Users
export const getUsers = async (_req: any, res: any) => {
    try {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ users, message: 'You got all users' }));
    } catch (err: any) {
        // res.writeHead(500, { 'Content-type': 'application/json' });
        res.end(500, JSON.stringify({ message: err.message }));
    }
};

//get User
// export const getUser = async (_req: any, res: any) => {
//     try {
//         const users = await findUsers();
//         res.writeHead(200, { 'Content-type': 'application/json' });
//         res.end(JSON.stringify({ users, message: 'You got all users' }));
//     } catch (err: any) {
//         console.error(`Operation failed: ${ err.message }`);
//     }
// };

//create new User
export const createUser = async (req: any, res: any) => {
    try {
        const body = await getRequestBody(req);
        const user = JSON.parse(body) as User;

        const { username, age, hobbies } = user;

        if (!username || !age || !hobbies) {
            throw new Error('User body does not contain required fields');
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
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
};