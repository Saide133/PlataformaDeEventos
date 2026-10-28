import { UserRepository } from '../repositories/users.repository.js';
import { createHash } from '../utils/hash.js';
import { isValidPassword } from '../utils/hash.js';


const userRepository = new UserRepository();

export const registerService = async ({ first_name, last_name, email, password }) => {

    if (!first_name || !last_name || !email || !password){
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
        role: 'user'
    };

    const newUser = await userRepository.createUser(userData);

    return newUser;

};

export const loginService = async ({ email, password }) => {

    if (!email || !password){
        const dataMissing = new Error('Todos los campos son obligatorios');
        dataMissing.statusCode = 400;
        throw dataMissing;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)){
        const invalidEmail = new Error('Credenciales inválidas');
        invalidEmail.statusCode = 401;
        throw invalidEmail;
    };

    const normalizedEmail = email.toLocaleLowerCase().trim();

    const userExists = await userRepository.getUserByEmail(normalizedEmail);

    if (!userExists){
        const userNotExists = new Error('Credenciales inválidas');
        userNotExists.statusCode = 401;
        throw userNotExists;
    };

    const validPassword = await isValidPassword(password, userExists.password);

    if (!validPassword){
        const invalidPassword = new Error('Credenciales inválidas');
        invalidPassword.statusCode = 401;
        throw invalidPassword;
    }

    return userExists;

};