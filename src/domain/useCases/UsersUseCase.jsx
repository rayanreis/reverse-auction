import { UsersRepository } from '../../infrastructure/repository/Users';

export class UsersUseCase {
    constructor(usersRepository) {
        this.usersRepository = new UsersRepository();
    }

    async registerUser(email, password) {
        try {
            return await this.usersRepository.createUser(email, password);
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            return await this.usersRepository.loginUser(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getUserProfile(uid) {
        if (!uid) {
            throw new Error('User ID is required');
        }

        try {
            return await this.usersRepository.getUserProfile(uid);
        } catch (error) {
            throw error;
        }
    }

    async updateUserProfile(displayName, photoURL) {
        try {
            return await this.usersRepository.updateUser(displayName, photoURL);
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await this.usersRepository.logoutUser();
        } catch (error) {
            throw error;
        }
    }

    async deleteAccount() {
        try {
            await this.usersRepository.deleteUserAccount();
        } catch (error) {
            throw error;
        }
    }

    async requestPasswordReset(email) {
        try {
            await this.usersRepository.resetPassword(email);
        } catch (error) {
            throw error;
        }
    }

    getCurrentUser() {
        return this.usersRepository.getCurrentUser();
    }
}
