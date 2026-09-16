import { getUserByEmail, createUser } from '../repositories/users.repository.js';
import { createHash } from '../utils/hash.js';

export const registerUser = async ({ first_name, last_name, email, password }) => {
    if (!first_name || !last_name || !email || !password){
        const error = new Error('Todos los campos son obligatorios');
        error.statusCode = 400;
        throw error;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        const error = new Error('El email no es válido');
        error.statusCode = 400;
        throw error; 
    };

    if (password.length < 8){
        const error = new Error('La contraseña debe tener al menos 8 caracteres');
        error.statusCode = 400;
        throw error;
    };

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await getUserByEmail(normalizedEmail);

    if (userExists){
        const error = new Error('Ya existe un usuario registrado con ese email');
        error.statusCode = 409;
        throw error;
    };
    
    const hashedPassword = await createHash(password);

    const userData = {
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user'
    };

    const newUser = await createUser(userData);

    return newUser;
};