import cluster from 'node:cluster';
import http from 'http';
import process from 'node:process';
import os from 'os';
import dotenv from 'dotenv';
import path from 'path';

import { getUsers, createUser, getUser, deleteUser } from './controllers/user-controller';

dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE_PORT = Number(process.env.PORT || 4000);

const HOST: string | undefined = process.env.HOST;

const numCpus: number = os.cpus().length;

const workerPorts: number[] = [...Array(numCpus).keys()].map(i => BASE_PORT + i + 1);

export const multiServer = () => {
    if (cluster.isPrimary) {
        console.log(`Starting ${numCpus} workers`);

        for (let i = 1; i <= numCpus; i += 1) {
            cluster.fork();
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

    } else {
        const workerPort = BASE_PORT + cluster.worker!.id;

        http.createServer((req: any, res: any) => {

            if (req.url === '/api/users' && req.method === 'GET') {
                getUsers(req, res);
                console.log('current port', req.headers);
            } else if (req.url === '/api/users' && req.method === 'POST') {
                createUser(req, res);
                console.log('current port', req.headers);
            } else if (req.url.startsWith('/api/users/') && req.method === 'GET') {
                getUser(req, res);
                console.log('current port', req.headers);
            } else if (req.url.startsWith('/api/users/') && req.method === 'DELETE') {
                deleteUser(req, res);
                console.log('current port', req.headers);
            } else {
                res.writeHead(404, { 'Content-type': 'application/json' });
                res.end('Route not found. Please check your request');
            }
        }).listen(workerPort);
    }
    // ['SIGINT', 'SIGTERM', 'SIGQUIT']
    //     .forEach(signal => process.on(signal, () => {
    //         process.exit(0);
    //     }));
};

            // process.on('exit', () => {
        //     server.close(() => {
        //         process.exit(0);
        //     });
        // });

        // "module": "commonjs",
        // "type": "module",
