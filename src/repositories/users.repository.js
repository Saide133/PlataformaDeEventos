import { findByEmail, createUser as createUserInDb, findById } from '../dao/users.dao.js';

export const getUserByEmail = async (email) => {
    return await findByEmail(email);
};

export const createUser = async (userData) => {
    return await createUserInDb(userData);
};

export const getUserById = async (_id) => {
    return await findById(_id);
};