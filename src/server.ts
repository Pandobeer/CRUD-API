import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
// import url from 'node:url';

import { getUsers, createUser, getUser } from './controllers/user-controller';
import { myURL } from './helpers';

dotenv.config({ path: path.join(__dirname, '../.env') });
// const myURL = url.resolve();
const PORT = process.env.PORT;
// const HOST = process.env.HOST;

const server = http.createServer((req: any, res: any) => {
    console.log(req.url);

    if (req.url === '/api/users' && req.method === 'GET') {
        getUsers(req, res);
    } else if (req.url === '/api/users' && req.method === 'POST') {
        createUser(req, res);
    } else if (req.url.match(/\/api\/users\/([A-Za-z0-9-]+)/) && req.method === 'GET') {
        getUser(req, res);
    } else {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found. Please check your request' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`URL is ${myURL}`);
});
