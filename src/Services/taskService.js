import Task from "../Models/taskModel.js"
import User from "../Models/userModel.js";
import UserService from "../Services/userService.js";

class TaskService {
    static async createTask(title, description, expirationDate, userId) {
        try {
            // Verificar quais campos estão preenchidos
            const data = {};

            if (description) {
                data.description = description;
            }
            if (expirationDate) {
                data.expirationDate = expirationDate;
            }
            if (title) {
                data.title = title;
            }
            if (userId) {
                data.userId = userId;
            }

            // Verificar se o usuário existe
            const user = await UserService.getUserById(userId);
            if (!user) {
                throw new Error("User not found.");
            }
            
            const task = await Task.create(data);

            return task;
        } catch (error) {
            throw new Error ("Error creating task: " + error.message);
        }
    }

    static async updateTask(taskId, updateData) {
        try {
            const task = await Task.findByPk(taskId);
            if (!task) {
                throw new Error("Task not found.");
            }

            // Atualizar task
            await task.update(updateData);

            const updatedTask = await Task.findByPk(taskId);

            return updatedTask;
        } catch (error) {
            throw new Error("Error updating task: " + error.message);
        }
    }

    static async deleteTask(taskId) {
        try {
            const task = await Task.findByPk(taskId);
            if (!task) {
                throw new Error("Task not found.");
            }

            await task.destroy();

            return { message: "Task deleted successfully." };
        } catch (error) {
            throw new Error("Error deleting task: " + error.message);
        }
    }

    static async getTaskById(taskId) {
        try {
            const task = await Task.findByPk(taskId);
            if (!task) {
                throw new Error("Task not found.");
            }

            return task;
        } catch (error) {
            throw new Error("Error retrieving task: " + error.message);
        }
    }

    static async getAllTasksByUserId(userId) {
        try {
            // Verificar se usuário existe
            const user = await UserService.getUserById(userId);
            if (!user) {
                throw new Error("User not found.");
            }

            const tasks = await Task.findAll({
                where: { userId },
            });

            return tasks;
        } catch (error) {
            throw new Error("Error retrieving tasks: " + error.message);
        }
    }
}

export default TaskService;