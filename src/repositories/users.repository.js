import { UserDAO } from '../dao/users.dao.js';

const userDAO = new UserDAO();

export class UserRepository {

    async getUserByEmail(email) {
        return await userDAO.findByEmail(email);
    };

    async createUser(userData) {
        return await userDAO.create(userData);
    };

    async getUserById(_id) {
        return await userDAO.findById(_id);
    };

    async getAllUsers() {
        return userDAO.findAll();
    };

};