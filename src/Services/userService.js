import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserService {
    static async registerUser(name, email, password) {
        try {
            // Verificar se o usuário já existe
            const existingUser = await User.findOne({ where: { email, isDeleted: false } });
            if (existingUser && !existingUser.isDeleted) {
                throw new Error("User already exists with this email.");
            }

            // Verificar se os campos obrigatórios estão preenchidos
            if (!name || !email || !password) {
                throw new Error("Name, email, and password are required.");
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
            const existingUser = await User.findByPk(userId);
            if (!existingUser || existingUser.isDeleted) {
                throw new Error("User not found.");
            }

            // Verificar quais campos foram fornecidos
            const data = {};

            if (name) {
                data.name = name;
            } 
            if (email) {
                // Verificar se o email já está em uso por outro usuário
                const userWithEmail = await User.findOne({ where: { email, isDeleted: false } });
                if (userWithEmail && (userWithEmail.id !== userId)) {
                    throw new Error("Email is already in use by another user.");
                }

                data.email = email;
            } 
            if (!name && !email) {
                throw new Error("Missing required fields: name and email.");
            }

            // Atualizar usuário
            await existingUser.update(data);
            const updatedUser = await User.findByPk(userId);

            return updatedUser;
        } catch (error) {
            throw new Error("Error updating user: " + error.message);
        }
    }

    static async loginUser(email, password) {
        try {
            // Inicializar flags
            var userFlag = false;
            var passwordFlag = false;

            // Verificar se usuário existe
            const existingUser = await User.findOne({ where: { email, isDeleted: false } });
            if (!existingUser) {
                userFlag = true;
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
                passwordFlag = true;
            }

            if (userFlag || passwordFlag) {
                throw new Error("Invalid email or password.");
            }
        } catch (error) {
            throw new Error("Error logging in user: " + error.message);
        }
    }

    static async deleteUser(userId) {
        try {
            // Verificar se usuário existe
            const existingUser = await User.findByPk(userId);
            if (!existingUser || existingUser.isDeleted) {
                throw new Error("User not found.");
            }

            // Excluir usuário: soft delete
            await existingUser.update({ isDeleted: true });
            // Hard delete: cawait User.destroy({ where: { id: userId } });

            return { message: "User deleted successfully." };
        } catch (error) {
            throw new Error("Error deleting user: " + error.message);
        }
    }

    static async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user || user.isDeleted) {
                throw new Error("User not found.");
            }
    
            return user;
        } catch (error) {
            throw new Error("Error retrieving user: " + error.message);
        }
    }

    static async getUserByEmail(email) {
        try {
            const user = await User.findOne({ where: { email, isDeleted: false } });
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
            const users = await User.findAll({ where: { isDeleted: false } });
            if (!users || users.length === 0) {
                throw new Error("No users found.");
            }

            return users;
        } catch (error) {
            throw new Error("Error retrieving users: " + error.message);
        }
    }
}

export default UserService;