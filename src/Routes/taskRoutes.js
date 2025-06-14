import TaskController from "../Controllers/taskController.js";
import auth from "../Middleware/auth.js";

const taskRoutes = (app) => {
    // Rotas protegidas por autenticação
    app.get("/tasks/:id", auth, TaskController.getTaskById);
    app.put("/tasks/:id", auth, TaskController.updateTask);
    app.delete("/tasks/:id", auth, TaskController.deleteTask);
    app.get("/tasks", auth, TaskController.getAllTasksByUserId);
    app.post("/tasks", auth, TaskController.createTask);
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
 * /tasks:
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
 * /tasks/{id}:
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
 * /tasks/{id}:
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
 * /tasks/{id}:
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