import { Sequelize } from "sequelize";
import mysql2 from "mysql2/promise";
import logger from "../logger.js";
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

        logger.info(`Database ${process.env.DB_NAME} created or already exists.`);

        await connection.end();
    } catch (error) {
        logger.error(`Unable to create database: ${error.message}`, { error });
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
);

async function initializeDatabase() {
    try {
        await createDatabase();
        await sequelize.authenticate();

        logger.info("Database connection has been established successfully.");
    } catch (error) {
        logger.error(`Unable to connect to the database: ${error.message}`, { error });
    }
}

export { sequelize, initializeDatabase };
