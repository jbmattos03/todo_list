import UserService from "../Services/userService.js";

class UserController {
    static async registerUser(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await UserService.registerUser(name, email, password);
            const userObj = user.toJSON();

            // Remover senha do objeto de resposta
            delete userObj.password;

            res.status(201).json({ message: "User registered successfully", userObj });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const token = await UserService.loginUser(email, password);

            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.user.id; // Obtém o ID do usuário do token JWT
            const { name, email } = req.body;

            const updatedUser = await UserService.updateUser(name, email, userId);

            // Remover senha do objeto de resposta
            const userObj = updatedUser.toJSON();
            delete userObj.password;

            res.status(200).json({ message: "User updated successfully", userObj }); 
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            // Obtém o ID do usuário do token JWT
            const userId = req.user.id;
            const result = await UserService.deleteUser(userId);

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.getUserById(userId);

            // Remover senha do objeto de resposta
            const userObj = user.toJSON();
            delete userObj.password;

            res.status(200).json(userObj);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();

            // Remover senha de todos os usuários
            const usersObj = users.map(user => {
                const userJson = user.toJSON();
                delete userJson.password;
                return userJson;
            });

            res.status(200).json(usersObj);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await UserService.getUserByEmail(email);

            // Remover senha do objeto de resposta
            const userObj = user.toJSON();
            delete userObj.password;

            res.status(200).json(userObj);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default UserController;
