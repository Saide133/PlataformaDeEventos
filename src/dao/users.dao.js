import User from '../models/User.js';

export class UserDAO {

    async findByEmail(email) {
        try {
            const user = await User.findOne({ email }).select('+password');
            return user;
        } catch (error) {
            throw new Error('Error al buscar usuario por email');
        }
    };

    async create(userData) {
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
            if (error.code === 11000) {
                const duplicateError = new Error('El correo electrónico ya está en uso');
                duplicateError.statusCode = 409;
                throw duplicateError;
            }
            throw new Error('Error al crear usuario');
        }
    };

    async findById(_id) {
        try{
            const user = await User.findById(_id);
            return user;
        }catch (error){
            throw new Error('Usuario no encontrado')
        }
    };

    async findAll() {
        try{
            const users = await User.find();
            return users;
        }catch (error){
            throw new Error('Error al obtener usuarios')
        }
    };

};