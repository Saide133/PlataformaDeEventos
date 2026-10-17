import { getAllUsers, createUser as createUserInRepo } from '../repositories/users.repository.js';
import { createHash } from '../utils/hash.js';

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener usuarios' });
    }
};

export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;

        if (!first_name || !last_name || !email || !password || !role) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await createHash(password);
        const userData = { first_name, last_name, email, password: hashedPassword, role };
        const newUser = await createUserInRepo(userData);

        res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message || 'Error al crear usuario' });
    }
};