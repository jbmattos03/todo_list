import { DataTypes, Model } from "sequelize";
import sequelize from "../Database/database.js";
import User from "./userModel.js";

class Task extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false, // Garantir participação total
            },
            onDelete: "CASCADE", // Excluir tarefas associadas ao usuário
            onUpdate: "CASCADE", // Atualizar tarefas se o usuário for atualizado
            as: "user", // Nome da associação
        });
    }
}

Task.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("pending", "completed"),
        defaultValue: "pending",
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Referência ao modelo User
            key: "id",
        },
    },
}, {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: true, // Adiciona createdAt e updatedAt
});

export default Task;