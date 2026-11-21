import { CurrentUserDTO } from '../dto/current-user.dto.js';
import { CreateUserInputDTO } from '../dto/create-user-input.dto.js';
import { createUserByAdminService, getAllUsersService } from '../services/users.service.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        const usersDTO = users.map(user => new CurrentUserDTO(user));

        res.status(200).json({ status: 'success', payload: usersDTO });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const userData = new CreateUserInputDTO(req.body);
        const newUser = await createUserByAdminService(userData);
        const userDTO = new CurrentUserDTO(newUser);

        res.status(201).json({ status: 'success', payload: userDTO });
    } catch (error) {
        next(error);
    }
};