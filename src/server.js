import express from "express";
import userRoutes from "./Routes/userRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import { sequelize, initializeDatabase } from "./Database/database.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./logger.js";

// Criando servidor Express
const app = express();
app.use(express.json()); // Especificando que o servidor irá receber JSON

// Configurando o Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "To-Do List API",
            version: "1.0.0",
            description: "API for managing tasks and users in a task management application."
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8000}`
            }
        ]
    },
    apis: ["src/Routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Importando rotas
userRoutes(app);
taskRoutes(app);

// Inicializando database com Sequelize
initializeDatabase().then(() => {
    sequelize.sync().then(
        () => {
            logger.info("Synchronization with the database completed successfully.");

            // Inicializando o servidor após a conexão com o banco de dados
            app.listen(process.env.PORT || 8000, () => {
                logger.info(`Server running on port ${process.env.PORT || 8000}`);
            });
        }
    ).catch((error) => {
        logger.error(`Unable to sync with the database: ${error.message}`, { error });
    });
}).catch((error) => {
    logger.error(`Unable to connect to the database: ${error.message}`, { error });
});