import TaskController from "../Controllers/taskController.js";
import auth from "../Middleware/auth.js";

const taskRoutes = (app) => {
    // Rotas protegidas por autenticação
    app.get("/api/tasks/:id", auth, TaskController.getTaskById);
    app.put("/api/tasks/update/:id", auth, TaskController.updateTask);
    app.delete("/api/tasks/delete/:id", auth, TaskController.deleteTask);
    app.get("/api/tasks", auth, TaskController.getAllTasksByUserId);
    app.post("/api/tasks/create", auth, TaskController.createTask);
}

export default taskRoutes;