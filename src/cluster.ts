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

//TODO - 1: to check

// if (cluster.isPrimary) {
//     console.log(`Load balancer is running on ${HOST}:${BASE_PORT}/api`);
//     console.log(`Starting ${numCPUs} workers`);

//     // Fork workers
//     for (let i = 0; i < numCPUs; i++) {
//         const worker = cluster.fork();

//         worker.on('message', (msg: any) => {
//             if (msg.cmd && msg.cmd === 'notifyRequest') {
//                 const nextWorker = getNextWorker();
//                 nextWorker?.send({ cmd: 'handleRequest', msg });
//             }
//         });
//     }

//     const getNextWorker = () => {
//         const indexForWorker: number = workerIndex % numCPUs;
//         const workersObj: NodeJS.Dict<Worker> | undefined = cluster.workers;
//         if (workersObj) {
//             const currentWorker: Worker | undefined = Object.values(workersObj)[indexForWorker];
//             workerIndex++;
//             return currentWorker;
//         }
//     };

//     cluster.on('exit', (worker) => {
//         // process.kill(process.pid);
//         console.log(`worker ${worker.process.pid} died`);
//     });

//     // cluster.on('disconnect', (worker) => {
//     //     delete cluster.workers![worker.id];
//     // });

// } else {
//     workerPort += Number(cluster.worker!.id);

//     http.createServer((_req: http.IncomingMessage, res: http.ServerResponse) => {
//         res.writeHead(200);
//         res.end('hello world\n');
//     }).listen(`${workerPort}`);

//     console.log(`Worker ${process.pid} started and listening on port ${workerPort}`);
//     process.on('message', (msg: any) => {
//         if (msg.cmd && msg.cmd === 'handleRequest') {
//             console.log(`Worker ${process.pid} handled request: ${msg.msg}`);
//         }
//     });
// }

    // process.on('exit', (code) => {
    //     if (code === 0) {
    //         process.kill(process.pid);
    //     }
    // });

            // process.on('exit', () => {
        //     server.close(() => {
        //         process.exit(0);
        //     });
        // });

        // "module": "commonjs",
