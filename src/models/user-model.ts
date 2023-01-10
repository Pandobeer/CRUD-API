//TODO: need to get an object with all users
let users: [] = [];

export const findUsers = () => {
    return new Promise((resolve, reject) => {
        resolve(users);
    });
};