import TaskService from "../Services/taskService.js";
import { isEmpty, isBlank } from "../Utils/validation.js";
import logger from "../logger.js";

class TaskController {
    static async createTask(req, res) {
        try {
            const { title, description, expirationDate } = req.body;
            if (isEmpty(title)) {
                logger.warn("Task creation attempt with missing or empty title.");
                return res.status(400).json({ error: "Title is required." });
            }
            const userId = req.user.id; // Obtém o ID do usuário do token JWT
            logger.info(`Creating task for user ID: ${userId} with title: ${title}`);

            const task = await TaskService.createTask(title, description, expirationDate, userId);
            const taskObj = task.toJSON();
            logger.info("Task created successfully.");
            logger.debug(`Task details: ${JSON.stringify(taskObj)}`);

            res.status(201).json({ message: "Task created successfully" });
        } catch (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    static async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            if (!taskId) {
                logger.warn("Task ID parameter is missing in the request.");
                return res.status(400).json({ error: "Task ID is required" });
            }

            const updateData = req.body;
            if (!updateData || Object.keys(updateData).length === 0) {
                logger.warn("Update attempt with no fields or empty provided.");
                return res.status(400).json({ error: "At least one field is required to update." });
            }
            else if (isBlank(updateData.title)) {
                logger.warn("Update attempt with blank title.");
                return res.status(400).json({ error: "Title is required." });
            }
            logger.info(`Updating task with ID: ${taskId}`);

            const updatedTask = await TaskService.updateTask(taskId, updateData);
            const taskObj = updatedTask.toJSON();
            logger.info("Task updated successfully.");
            logger.debug(`Updated task details: ${JSON.stringify(taskObj)}`);

            res.status(200).json(updatedTask);
        } catch (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            if (!taskId) {
                logger.warn("Task ID parameter is missing in the request.");
                return res.status(400).json({ error: "Task ID is required" });
            }
            logger.info(`Deleting task with ID: ${taskId}`);

            const result = await TaskService.deleteTask(taskId);
            logger.info("Task deleted successfully.");

            res.status(200).json(result);
        } catch (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    static async getTaskById(req, res) {
        try {
            const taskId = req.params.id;
            if (!taskId) {
                logger.warn("Task ID parameter is missing in the request.");
                return res.status(400).json({ error: "Task ID is required" });
            }
            logger.info(`Retrieving task with ID: ${taskId}`);

            const task = await TaskService.getTaskById(taskId);
            const taskObj = task.toJSON();
            logger.info("Task retrieved successfully.");
            logger.debug(`Task details: ${JSON.stringify(taskObj)}`);

            res.status(200).json(task);
        } catch (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllTasksByUserId(req, res) {
        try {
            const userId = req.user.id; // Obtém o ID do usuário do token JWT
            const { status } = req.query; // Obtém o status da query string, se fornecido

            let tasks;
            if (status) {
                if (isBlank(status)) {
                    logger.warn("Status query parameter is blank.");
                    return res.status(400).json({ error: "Status cannot be blank." });
                }
                logger.info(`Retrieving tasks for user ID: ${userId} with status: ${status}`);

                tasks = await TaskService.filterTasks(userId, status);
                if (!tasks || tasks.length === 0) {
                    logger.warn("No tasks found for the user with the specified status.");
                    return res.status(404).json({ message: "No tasks found for the specified status." });
                }
                else {
                    const tasksObj = tasks.map(task => task.toJSON());
                    logger.info("Tasks retrieved successfully with the specified status.");
                    logger.debug(`Tasks: ${JSON.stringify(tasksObj)}`);
                }
            }
            else {
                logger.info(`Retrieving all tasks for user ID: ${userId}`);

                tasks = await TaskService.getAllTasksByUserId(userId);
                if (!tasks || tasks.length === 0) {
                    logger.warn("No tasks found for the user.");
                    return res.status(404).json({ message: "No tasks found." });
                }
                else {
                    const tasksObj = tasks.map(task => task.toJSON());
                    logger.info("Tasks retrieved successfully.");
                    logger.debug(`Tasks: ${JSON.stringify(tasksObj)}`);
                }
            }
                

            

            res.status(200).json(tasks);
        } catch (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }
}

export default TaskController;