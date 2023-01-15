import dotenv from 'dotenv';
import { multiServer } from './cluster';
import { server } from './server';

const IS_MULTI_MODE = process.env.MODE === 'multi';

dotenv.config();

if (IS_MULTI_MODE) {
    multiServer();
    console.log(IS_MULTI_MODE, 'multiserver');
} else {
    server();
}

['SIGINT', 'SIGTERM', 'SIGQUIT']
    .forEach(signal => process.on(signal, () => {
        process.exit(0);
    }));
