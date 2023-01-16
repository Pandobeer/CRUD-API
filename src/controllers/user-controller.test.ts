import { usersDB } from "../users";
import { getUser, getUsers, createUser, deleteUser } from "./user-controller";

jest.mock('./../helpers', () => ({
    getRequestBody: () => '{"username": "John Doe", "age": 30, "hobbies": ["reading", "hiking"] }',
}));

jest.mock('uuid', () => ({
    ...jest.requireActual('uuid'),
    v4: () => '91c8b859-2342-4d62-9185-228dfb519faf'
}));

const mockUserWithId = {
    id: '91c8b859-2342-4d62-9185-228dfb519faf',
    username: 'John Doe',
    age: 30,
    hobbies: ['reading', 'hiking']
};

describe('user-controller', () => {
    describe('getUsers', () => {
        it('should return all users', async () => {
            // create a mock request and response object
            const req = {};
            const res = {
                writeHead: jest.fn(),
                end: jest.fn()
            };

            // call the getUsers function
            await getUsers(req, res);

            // assert that the correct status code and JSON string were sent
            expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-type': 'application/json' });
            expect(res.end).toHaveBeenCalledWith(JSON.stringify({ usersDB, message: 'You got all users' }));
        });
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            // create a mock request and response object
            const req = {
                on: jest.fn(),
                pipe: jest.fn()
            };

            const res = {
                writeHead: jest.fn(),
                end: jest.fn(),
                on: jest.fn()
            };

            const mockUser = { username: 'John Doe', age: 30, hobbies: ['reading', 'hiking'] };

            // call the createUser function
            await createUser(req, res);

            // assert that the correct status code and JSON string were sent
            expect(res.writeHead).toHaveBeenCalledWith(201, { 'Content-type': 'application/json' });
            expect(res.end).toHaveBeenCalledWith(JSON.stringify({
                newUser: {
                    id: '91c8b859-2342-4d62-9185-228dfb519faf',
                    username: mockUser.username,
                    age: mockUser.age,
                    hobbies: mockUser.hobbies
                },
                message: 'You created new User'
            }));
        });
    });

    describe('getUser', () => {
        beforeAll(() => {
            // create a mock user
            usersDB.push(mockUserWithId);
        });

        it('should return a user', async () => {
            // create a mock request and response object
            const req = {
                url: '/api/users/91c8b859-2342-4d62-9185-228dfb519faf'
            };
            const res = {
                writeHead: jest.fn(),
                end: jest.fn()
            };

            // call the getUser function
            await getUser(req, res);

            // assert that the correct status code and JSON string were sent
            expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-type': 'application/json' });
            expect(res.end).toHaveBeenCalledWith(JSON.stringify({
                user: mockUserWithId,
                message: 'User and information about the User'
            }));
        });

        afterAll(() => {
            usersDB.splice(0, usersDB.length);
        });
    });

    describe('deleteUser', () => {
        beforeAll(() => {
            // create a mock user
            usersDB.push(mockUserWithId);
        });
        it('should delete a user', async () => {
            // create a mock request object with a userId
            const req = {
                url: '/api/users/91c8b859-2342-4d62-9185-228dfb519faf',
                on: jest.fn()
            };

            // create a mock response object
            const res = {
                writeHead: jest.fn(),
                end: jest.fn(),
                on: jest.fn()
            };

            //display existing DB with mock user
            console.log('usersDB with mockUser:', usersDB);

            // call the deleteUser function
            await deleteUser(req, res);

            //display updated DB after deleting mock user
            console.log('usersDB after deleting user:', usersDB);

            // assert that the correct status code and JSON string were sent
            expect(res.writeHead).toHaveBeenCalledWith(204, { 'Content-type': 'application/json' });
            expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'User was successfully deleted' }));
        });

        afterAll(() => {
            usersDB.splice(0, usersDB.length);
        });
    });
});
