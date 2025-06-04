import UserService from "../Services/userService.js";
import logger from "../logger.js";
import { isValidEmail, isEmpty } from "../Utils/validation.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

class UserController {
    static async registerUser(req, res) {
        try {
            const { name, email, password } = req.body;
            if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
                logger.warn("Registration attempt with missing fields.");
                return res.status(400).json({ error: "Name, email, and password are required." });
            }
            else if (!isValidEmail(email)) {
                logger.warn("Registration attempt with invalid email format.");
                return res.status(400).json({ error: "Invalid email format." });
            }
            logger.info(`Registering user with email: ${email}`);
            
            const user = await UserService.registerUser(name, email, password);

            // Remover senha do objeto de resposta
            const userObj = user.toJSON();
            delete userObj.password;
            logger.info("User registered successfully.");
            logger.debug(`User details: ${JSON.stringify(userObj)}`);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            if (isEmpty(email) || isEmpty(password)) {
                logger.warn("Login attempt with missing fields.");
                return res.status(400).json({ error: "Email and password are required." });
            }
            else if (!isValidEmail(email)) {
                logger.warn("Login attempt with invalid email format.");
                return res.status(400).json({ error: "Invalid email format." });
            }
            logger.info(`User login attempt with email: ${email}`);

            const token = await UserService.loginUser(email, password);
            logger.info("User logged in successfully.");

            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            logger.error(error.message);
            res.status(401).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.user.id; // Obtém o ID do usuário do token JWT
            const { name, email } = req.body;
            if (isEmpty(name) && isEmpty(email)) {
                logger.warn("Update attempt with no fields provided.");
                return res.status(400).json({ error: "At least one field (name or email) is required to update." });
            }
            else if (!isValidEmail(email)) {
                logger.warn("Update attempt with invalid email format.");
                return res.status(400).json({ error: "Invalid email format." });
            }
            logger.info(`Updating user with ID: ${userId}`);

            const updatedUser = await UserService.updateUser(name, email, userId);

            // Remover senha do objeto de resposta
            const userObj = updatedUser.toJSON();
            delete userObj.password;
            logger.info("User updated successfully.");
            logger.debug(`Updated user details: ${JSON.stringify(userObj)}`);

            res.status(200).json({ message: "User updated successfully", userObj }); 
        } catch (error) {
            logger.error(error.message);
            if (error.message.includes("not found")) {
                return res.status(404).json({ error: error.message });
            } else {
                return res.status(500).json({ error: error.message });
            }
        }
    }

    static async deleteUser(req, res) {
        try {
            // Obtém o ID do usuário do token JWT
            const userId = req.user.id;
            logger.info(`Deleting user with ID: ${userId}`);

            const result = await UserService.deleteUser(userId);
            logger.info("User deleted successfully.");

            res.status(200).json(result);
        } catch (error) {
            logger.error(error.message);
            res.status(404).json({ error: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const userId = req.params.id;
            if (!userId) {
                logger.warn("User ID parameter is missing in the request.");
                return res.status(400).json({ error: "User ID is required" });
            }
            logger.info(`Retrieving user with ID: ${userId}`);

            const user = await UserService.getUserById(userId);

            // Remover senha do objeto de resposta
            const userObj = user.toJSON();
            delete userObj.password;

            logger.info(`User with ID: ${userId} retrieved successfully.`);
            logger.debug(`User details: ${JSON.stringify(userObj)}`);

            res.status(200).json(userObj);
        } catch (error) {
            logger.error(error.message);
            res.status(404).json({ error: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            logger.info("Retrieving all users.");
            const users = await UserService.getAllUsers();

            // Remover senha de todos os usuários
            const usersObj = users.map(user => {
                const userJson = user.toJSON();
                delete userJson.password;
                return userJson;
            });

            logger.info("All users retrieved successfully.");
            logger.debug(`Users: ${JSON.stringify(usersObj)}`);

            res.status(200).json(usersObj);
        } catch (error) {
            logger.error(error.message);
            res.status(404).json({ error: error.message });
        }
    }

    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            if (!email) {
                logger.warn("Email parameter is missing in the request.");
                return res.status(400).json({ error: "Email is required" });
            }
            logger.info(`Retrieving user with email: ${email}`);
            
            const user = await UserService.getUserByEmail(email);

            // Remover senha do objeto de resposta
            const userObj = user.toJSON();
            delete userObj.password;

            logger.info(`User with email: ${email} retrieved successfully.`);
            logger.debug(`User details: ${JSON.stringify(userObj)}`);

            res.status(200).json(userObj);
        } catch (error) {
            logger.error(error.message);
            res.status(404).json({ error: error.message });
        }
    }

    static async requestPasswordReset(req, res) {
        const { email } = req.body;
        if (isEmpty(email) || !isValidEmail(email)) {
            logger.warn("Password reset request with invalid or missing email.");
            return res.status(400).json({ error: "Valid email is required." });
        }
        logger.info(`Password reset request for email: ${email}`);

        try {
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            logger.info(`User found for password reset: ${user.email}`);
            const id = user.id;

            // Gerar token de redefinição de senha e armazenar no banco de dados
            const updatedUser = await UserService.generateResetToken(id);
            logger.info(`Password reset token generated for user ID: ${id}`);
            logger.debug(`User reset token: ${user.resetToken}`);
            //logger.debug(`User reset token expiration: ${user.resetTokenExpiration}`);

            // Criar conta de teste
            const testAccount = await nodemailer.createTestAccount();
            logger.info("Test email account created for sending password reset email.");

            // Enviar email de redefinição de senha
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Password Reset",
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://localhost:${process.env.PORT}/reset-password/${encodeURIComponent(updatedUser.resetToken)}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            logger.info(`Sending password reset email to: ${user.email}`);

            const info = await transporter.sendMail(mailOptions);
            logger.info("Password reset email sent successfully.");
            logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

            return res.status(200).json({ message: "Password reset email sent" });
        } catch (error) {
            logger.error(`Error sending password reset email: ${error.message}`);
            return res.status(500).json({ message: error.message });
        }
    }

    static async resetPassword(req, res) {
        const { token } = req.params;
        logger.debug(`Password reset token received: ${token}`);
        const { password } = req.body;
        if (isEmpty(token) || isEmpty(password)) {
            logger.warn("Password reset attempt with missing or empty token or password.");
            return res.status(400).json({ message: "Token and password are required" });
        }

        logger.info("Password reset attempt received");

        try {
            const user = await UserService.getUserByResetToken(token);
            if (!user || user.resetTokenExpiration < Date.now()) {
                logger.warn("Invalid or expired token provided for password reset.");
                return res.status(401).json({ message: "Invalid or expired token" });
            }
            logger.debug(`User found for password reset: ${user ? user.id : "No user found"}`);

            await UserService.updatePassword(user.id, password);
            logger.info("Password updated successfully");

            return res.status(200).json({ message: "Password has been reset" });
        } catch (error) {
            logger.error(`Error resetting password: ${error.message}`);
            return res.status(500).json({ message: "Error resetting password" });
        }
    }
}

export default UserController;
