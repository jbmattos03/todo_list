import UserService from "../Services/userService.js";
import logger from "../logger.js";
import { isValidEmail, isEmpty } from "../Utils/validation.js";

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
            res.status(400).json({ error: error.message });
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
            res.status(400).json({ error: error.message });
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
            res.status(400).json({ error: error.message });
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
            res.status(400).json({ error: error.message });
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
            res.status(400).json({ error: error.message });
        }
    }
}

export default UserController;
