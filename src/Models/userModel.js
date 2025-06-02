import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database.js";

class User extends Model {
    static associate(models) {
        this.hasMany(models.Task, {
            foreignKey: {
                name: "userId",
                allowNull: false, // Garantir participação total
            },
            onDelete: "CASCADE", // Excluir tarefas associadas ao usuário
            onUpdate: "CASCADE", // Atualizar tarefas se o usuário for atualizado
            as: "tasks", // Nome da associação
        });
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(72),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true, // Adiciona createdAt e updatedAt
})

export default User;