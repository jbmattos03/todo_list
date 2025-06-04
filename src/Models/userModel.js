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
    },
    password: {
        type: DataTypes.STRING(72),
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Define o padrão como false
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetTokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true, 
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true, // Adiciona createdAt e updatedAt
})

export default User;