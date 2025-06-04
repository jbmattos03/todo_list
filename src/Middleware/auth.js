import jwt from "jsonwebtoken";
import logger from "../logger.js";

function auth(req, res, next) {
    try {
        logger.info("Authentication middleware invoked.");

        // Verificar se o token está presente no cabeçalho Authorization
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        logger.debug("Token received.");

        // Verificar se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.debug("Token decoded successfully.");

        // Adicionar usuario decodificado ao objeto de requisição
        req.user = decoded;

        // Chamar o próximo middleware ou rota
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}

export default auth;