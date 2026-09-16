import { findByEmail, createUser as createUserInDb } from '../dao/users.dao.js';

export const getUserByEmail = async (email) => {
    return await findByEmail(email);
};

export const createUser = async (userData) => {
    return await createUserInDb(userData);
};