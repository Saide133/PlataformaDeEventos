import User from '../models/User.js';

export const findByEmail = async (email) => {
    try {
        const user = await User.findOne({ email});
        return user;
    } catch (error) {
        throw new Error('Error al buscar usuario por email');
    }
}

export const createUser = async (userData) => {
    try {
        const newUser = await User.create({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
            role: userData.role
        });
        return newUser;
    } catch (error) {
        throw new Error('Error al crear usuario');
    }
}