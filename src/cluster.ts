import cluster from 'node:cluster';
import http from 'http';
import process from 'node:process';
import os from 'os';
import dotenv from 'dotenv';
import path from 'path';

import { getUsers, createUser, getUser, deleteUser, updateUser } from './controllers/user-controller';
import { UserWithId } from './user-inteface';
import { usersDB } from './users';

dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE_PORT = Number(process.env.PORT || 4000);

const HOST = process.env.HOST;

const numCpus = os.cpus().length;

const workerPorts = Array(numCpus).fill(null).map((_, i) => BASE_PORT + i + 1);

export const multiServer = () => {
    if (cluster.isPrimary) {
        console.log(`Starting ${numCpus} workers`);

        for (let i = 1; i <= numCpus; i += 1) {
            const clusterWorker = cluster.fork();

            clusterWorker.on('message', (users: UserWithId[]) => {
                usersDB.splice(0, usersDB.length, ...users);
            });
        }

        cluster.on('exit', (worker) => {
            console.log(`worker ${worker.process.pid} died`);
        });

        let currentPortIndex = 0;

        const server = http.createServer((req, res) => {
            const port = workerPorts[currentPortIndex];

            const proxy = http.request({ port, path: req.url, method: req.method }, proxyRes => {
                res.writeHead(proxyRes.statusCode!, proxyRes.headers);
                proxyRes.pipe(res);
            });

            req.pipe(proxy);

            proxy.on('error', () => {
                res.writeHead(500);
                return res.end('Error while connecting to server');
            });

            currentPortIndex = (currentPortIndex + 1) % numCpus;
        });

        server.listen(BASE_PORT, () => {
            console.log(`Load balancer is listening on ${HOST}:${BASE_PORT}/api`);
        });

        server.on('request', () => {
            (Object.values(cluster.workers || {})).forEach((worker) => {
                worker.send(usersDB);
            });
        });

    } else {
        const workerPort = BASE_PORT + cluster.worker!.id;

        process.on('message', (users: UserWithId[]) => {
            usersDB.splice(0, usersDB.length, ...users);
        });

        http.createServer(async (req: any, res: any) => {
            if (req.url === '/api/users' && req.method === 'GET') {
                await getUsers(req, res);
            } else if (req.url === '/api/users' && req.method === 'POST') {
                await createUser(req, res);
            } else if (req.url.startsWith('/api/users/') && req.method === 'GET') {
                await getUser(req, res);
            } else if (req.url.startsWith('/api/users/') && req.method === 'DELETE') {
                await deleteUser(req, res);
            } else if (req.url.match(/\/api\/users\/([A-Za-z0-9-]+)/) && req.method === 'PUT') {
                await updateUser(req, res);
            } else {
                res.writeHead(404, { 'Content-type': 'application/json' });
                res.end('Route not found. Please check your request');
            }
        }).listen(workerPort);
    }
};
