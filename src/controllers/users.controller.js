import { CurrentUserDTO } from '../dto/current-user.dto.js';
import { createUserByAdminService, getAllUsersService } from '../services/users.service.js';

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();
        const usersDTO = users.map(user => new CurrentUserDTO(user));

        res.status(200).json({ status: 'success', payload: usersDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al obtener usuarios' });
    }
};

export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        const newUser = await createUserByAdminService({ first_name, last_name, email, password, role });
        const userDTO = new CurrentUserDTO(newUser);

        res.status(201).json({ status: 'success', payload: userDTO });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al crear usuario' });
    }
};