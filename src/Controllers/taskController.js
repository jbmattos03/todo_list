import TaskService from "../Services/taskService.js";

class TaskController {
    static async createTask(req, res) {
        try {
            const { title, description, expirationDate } = req.body;
            const userId = req.user.id; // Obtém o ID do usuário do token JWT

            await TaskService.createTask(title, description, expirationDate, userId);

            res.status(201).json({ message: "Task created successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const updateData = req.body;

            const updatedTask = await TaskService.updateTask(taskId, updateData);

            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            const result = await TaskService.deleteTask(taskId);

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getTaskById(req, res) {
        try {
            const taskId = req.params.id;
            const task = await TaskService.getTaskById(taskId);

            res.status(200).json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllTasksByUserId(req, res) {
        try {
            const userId = req.user.id; // Obtém o ID do usuário do token JWT
            const tasks = await TaskService.getAllTasksByUserId(userId);

            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default TaskController;