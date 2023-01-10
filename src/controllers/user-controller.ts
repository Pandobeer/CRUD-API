import { findUsers } from "../models/user-model";

export const getUsers = async (_req: any, res: any) => {
    try {
        const users = await findUsers();
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ users, message: 'You got all users' }));
    } catch (err: any) {
        console.error(`Operation failed: ${err.message}`);
    }
}; 