import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByEmail, createUser } from '../repositories/users.repository.js';
import { createHash, isValidPassword } from '../utils/hash.js';

passport.use( 
    'register', 
    new LocalStrategy(
        { usernameField: 'email',passReqToCallback: true },
        async (req, email, password, done) => {
            try{
                const { first_name, last_name } = req.body;

                if (!first_name || !last_name || !email || !password){
                    return done(null, false, { message: 'Todos los campos son obligatorios' });
                };

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(email)){
                    return done(null, false, { message: 'El email no es válido'})
                };

                if (password.length < 8){
                    return done(null, false, { message: 'La contraseña debe tener al menos 8 caracteres'})
                };

                const normalizedEmail =  email.toLocaleLowerCase().trim();

                const userExist =  await getUserByEmail(normalizedEmail);

                if (userExist){
                    return done(null, false, { message: 'Ya existe un usuario registrado con ese email'})
                };

                const hashedPassword =  await createHash(password);

                const userData = {
                    first_name,
                    last_name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: 'user'
                };

                const newUser = await createUser(userData);

                return done(null, newUser);

            }catch(error){
                return done(error);
            }
        }
    )
);

passport.use(
    'login',
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try{
                if (!email || !password){
                    return done(null, false, { message: 'Todos los campos son obligatorios'})
                };

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(email)){
                    return done(null, false, { message: 'Credenciales inválidas'})
                };

                const normalizedEmail = email.toLocaleLowerCase().trim();

                const userExists = await getUserByEmail(normalizedEmail);

                if (!userExists){
                    return done(null, false, { message: 'Credenciales inválidas'})
                };

                const validPassword = await isValidPassword(password, userExists.password);

                if (!validPassword){
                    return done(null, false, { message: 'Credenciales inválidas'})  
                };

                return done(null, userExists);

            } catch (error){
                return done(error);
            };
        }
    )
);