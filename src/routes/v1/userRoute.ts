import { Router } from 'express';
import type { RequestHandler } from 'express';
import { UserController } from '../../controllers/userController';
import { validateChangePassword, validateEditProfile } from '../../validators/userValidatior';
import auth from '../../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User routes
 */

router.post(
    '/change-password',
    auth,
    validateChangePassword,
    UserController.changePassword as unknown as RequestHandler
);

/**
 * @swagger
 * /api/v1/users/profile/info:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User profile fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: UUID of the user
 *                     name:
 *                       type: string
 *                       description: User's name
 *                     email:
 *                       type: string
 *                       description: User's email address
 *                     servicing_fee_percent:
 *                       type: number
 */
router.get('/profile/info', auth, UserController.getUserProfile as unknown as RequestHandler);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: User's full name
 *               profile_url:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: User's profile url
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input or account is blocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 errorCode:
 *                   type: string
 */
router.put(
    '/profile',
    auth,
    validateEditProfile,
    UserController.editProfile as unknown as RequestHandler
);

export default router;
