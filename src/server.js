import express from "express";
import userRoutes from "./Routes/userRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import { sequelize, initializeDatabase } from "./Database/database.js"

// Criando servidor Express
const app = express();
app.use(express.json()); // Especificando que o servidor irá receber JSON

// Importando rotas
userRoutes(app);
taskRoutes(app);

// Inicializando database com Sequelize
initializeDatabase().then(() => {
    sequelize.sync().then(
        () => {
            console.log("Synchronization with the database completed successfully.");

            // Inicializando o servidor após a conexão com o banco de dados
            app.listen(process.env.PORT || 8000, () => {
                console.log(`Server running on port ${process.env.PORT || 8000}`);
            });
        }
    ).catch((error) => {
        console.error("Unable to sync with the database:", error);
    });
}).catch((error) => {
        console.error("Unable to connect with the database:", error);
});