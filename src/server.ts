import http from 'http';
import dotenv from 'dotenv';
import path from 'path';

import { getUsers } from './controllers/user-controller';

dotenv.config({ path: path.join(__dirname, '../.env') });

const server = http.createServer((req: any, res: any) => {
    if (req.url === '/api/users' && req.method === 'GET') {
        getUsers(req, res);
    } else {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found. Please check your request' }));
    }



});

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
