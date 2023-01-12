import dotenv from 'dotenv';
import { IncomingMessage } from 'http';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const PROTOCOL = 'htpp';
const PATHUSERS = 'api/users';
const HOST = process.env.HOST;
const PORT = process.env.PORT;

export const myURL = new URL(`${PROTOCOL}://${HOST}:${PORT}/${PATHUSERS}`).href;

// export const getResolvedUrl = (from: string, to: string) => {
//     const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
//     if (resolvedUrl.protocol === 'resolve:') {
//         const { pathname, search } = resolvedUrl;
//         return pathname + search;
//     }
//     return resolvedUrl.toString();
// };

export const getRequestBody = (req: IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
};