import { Sequelize } from "sequelize";
import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function createDatabase() {
    try {
        const connection = await mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

        console.log(`Database ${process.env.DB_NAME} created or already exists.`);

        await connection.end();
    } catch (error) {
        console.error("Unable to create database:", error);
    }
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        timezone: "-03:00",
    }
)

async function initializeDatabase() {
    try {
        await createDatabase();
        await sequelize.authenticate();

        console.log("Database connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

export { sequelize, initializeDatabase };
