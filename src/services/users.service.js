import { UserRepository } from '../repositories/users.repository.js';
import { createHash } from '../utils/hash.js';

const userRepository = new UserRepository();

export const createUserByAdminService = async ({ first_name, last_name, email, password, role }) => {
    
    if (!first_name || !last_name || !email || !password || !role){
        const dataMissing = new Error('Todos los campos son obligatorios');
        dataMissing.statusCode = 400;
        throw dataMissing;
    };    
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)){
        const invalidEmail = new Error('El email no es válido');
        invalidEmail.statusCode = 400;
        throw invalidEmail;
    };

    if (password.length < 8){
        const passLengthError = new Error('La contraseña debe tener al menos 8 caracteres');
        passLengthError.statusCode = 400;
        throw passLengthError;
    };

    const normalizedEmail =  email.toLocaleLowerCase().trim();

    const userExist =  await userRepository.getUserByEmail(normalizedEmail);

    if (userExist){
        const existingUserError = new Error('Ya existe un usuario registrado con ese email');
        existingUserError.statusCode = 409;
        throw existingUserError;
    };
    
    const hashedPassword =  await createHash(password);

    const userData = {
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role
    };

    const newUser = await userRepository.createUser(userData);

    return newUser;
};

export const getAllUsersService = async () => {

    const allUsers = await userRepository.getAllUsers();

    return allUsers;
};