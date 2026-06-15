import * as bcrypt from 'bcrypt';
import { BadRequest, Unauthorized } from '../common/exceptions';
import { AppDataSource } from '../data-source';
import { User } from '../entities/userEntity';
import type { ChangePasswordDTO, EditProfileDTO } from '../types/userInterface';

export class UserService {
    static async getUserById(id: string): Promise<User> {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id },
        });

        if (!user) {
            throw new BadRequest('User not found');
        }

        return user;
    }

    static async changePassword(data: ChangePasswordDTO, userId: string): Promise<void> {
        const { oldPassword, newPassword } = data;
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOne({
            where: {
                id: userId,
            }
        });

        if (!user) {
            throw new BadRequest('User not found');
        }

        if (!user.password) {
            throw new BadRequest('Password not set. Please set your password first.');
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new BadRequest('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userRepo.update(
            { id: userId },
            { password: hashedPassword }
        );
    }

    static async getUserProfile(userId: string): Promise<User> {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                type: true,
                is_email_verified: true,
                name: true,
                profile_url: true
            },
        });

        if (!user) {
            throw new Unauthorized('User not found');
        }

        return user;
    }

    static async editProfile(data: EditProfileDTO, userId: string): Promise<User> {
        const userRepo = AppDataSource.getRepository(User);

        // Load user without password to prevent re-hashing
        const user = await userRepo.findOne({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                profile_url: true
            },
        });

        if (!user) {
            throw new BadRequest('User not found');
        }

        // Build update data with only provided fields
        const updateData: Partial<User> = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }
        if (data.profile_url !== undefined) {
            updateData.profile_url = data.profile_url;
        }

        if (Object.keys(updateData).length > 0) {
            await userRepo
                .createQueryBuilder()
                .update(User)
                .set(updateData)
                .where('id = :id', { id: userId })
                .execute();
        }

        // Return updated user with relations
        const updatedUser = await userRepo.findOne({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                profile_url: true
            },
        });

        if (!updatedUser) {
            throw new BadRequest('User not found');
        }

        return updatedUser;
    }
}
