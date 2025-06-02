import UserController from "../Controllers/userController.js";
import auth from "../Middleware/auth.js";

const userRoutes = (app) => {
    // Rotas protegidas por autenticação
    app.get("/api/users/:id", auth, UserController.getUserById);
    app.put("/api/users/update", auth, UserController.updateUser);
    app.delete("/api/users/delete", auth, UserController.deleteUser);
    app.get("/api/users", auth, UserController.getAllUsers);

    // Rotas públicas
    app.post("/api/users/register", UserController.registerUser);
    app.post("/api/users/login", UserController.loginUser);
}

export default userRoutes;