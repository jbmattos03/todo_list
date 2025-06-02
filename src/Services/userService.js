import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserService {
    static async registerUser(name, email, password) {
        try {
            // Verificar se o usuário já existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("User already exists with this email.");
            }

            // Verificar se os campos obrigatórios estão preenchidos
            if (!name || !email || !password) {
                throw new Error("Name, email, and password are required.");
            }

            // Verificar se email fornecido já está em uso
            const userWithEmail = await User.findOne({ where: { email } });
            if (userWithEmail) {
                throw new Error("Email is already in use by another user.");
            }

            // Criar hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Criar usuário no banco de dados
            const user = new User({ name, email, password: hashedPassword });
            await user.save();

            return user;
        } catch (error) {
            throw new Error("Error creating user: " + error.message);
        }
    }

    static async updateUser(name, email, userId) {
        try {
            // Verificar se o usuário existe
            const existingUser = await UserService.getUserById(userId);
            if (!existingUser) {
                throw new Error("User not found.");
            }

            // Verificar quais campos foram fornecidos
            const data = {};

            if (name) {
                data.name = name;
            } 
            else if (email) {
                // Verificar se o email já está em uso por outro usuário
                const userWithEmail = await User.findOne({ where: { email } });
                if (userWithEmail && (userWithEmail.id !== userId)) {
                    throw new Error("Email is already in use by another user.");
                }

                data.email = email;
            } 
            else {
                throw new Error("At least one field (name or email) must be provided for update.");
            }

            // Atualizar usuário
            await User.update(data, { where: { id: userId} });
            const updatedUser = await User.findByPk(userId);

            return updatedUser;
        } catch (error) {
            throw new Error("Error updating user: " + error.message);
        }
    }

    static async loginUser(email, password) {
        try {
            // Verificar se usuário existe
            const existingUser = await User.findOne({ where: { email } });
            if (!existingUser) {
                throw new Error("User has not been registered.");
            }

            // Verificar senha
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (isPasswordValid) {
                // Gerar token JWT
                const token = jwt.sign(
                    { 
                        id: existingUser.id, 
                        email: existingUser.email
                    }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: "1h", });

                return token;
            } else {
                throw new Error("Invalid password.");
            }
        } catch (error) {
            throw new Error("Error logging in user: " + error.message);
        }
    }

    static async deleteUser(userId) {
        try {
            // Verificar se usuário existe
            const existingUser = await UserService.getUserById(userId);

            if (!existingUser) {
                throw new Error("User not found.");
            }

            // Excluir usuário: Hard delete
            // TODO: Implementar soft delete
            await User.destroy({ where: { id: userId } });

            return { message: "User deleted successfully." };
        } catch (error) {
            throw new Error("Error deleting user: " + error.message);
        }
    }

    static async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("User not found.");
            }

            return user;
        } catch (error) {
            throw new Error("Error retrieving user: " + error.message);
        }
    }

    static async getUserByEmail(email) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error("User not found.");
            }

            return user;
        } catch (error) {
            throw new Error("Error retrieving user: " + error.message);
        }
    }

    static async getAllUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            throw new Error("Error retrieving users: " + error.message);
        }
    }
}

export default UserService;