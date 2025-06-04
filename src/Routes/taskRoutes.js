import TaskController from "../Controllers/taskController.js";
import auth from "../Middleware/auth.js";

const taskRoutes = (app) => {
    // Rotas protegidas por autenticação
    app.get("/api/tasks/:id", auth, TaskController.getTaskById);
    app.put("/api/tasks/update/:id", auth, TaskController.updateTask);
    app.delete("/api/tasks/delete/:id", auth, TaskController.deleteTask);
    app.get("/api/tasks", auth, TaskController.getAllTasksByUserId);
    app.post("/api/tasks/create", auth, TaskController.createTask);
};

export default taskRoutes;

// Documentação Swagger para as rotas de tarefa
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API for managing tasks.
 */
/**
 * @swagger
 * /api/tasks/create:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 */
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 */
/**
 * @swagger
 * /api/tasks/update/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
/**
 * @swagger
 * /api/tasks/delete/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted successfully
 */
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for a user
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 */