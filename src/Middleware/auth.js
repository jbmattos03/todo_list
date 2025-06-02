import jwt from "jsonwebtoken";

function auth(req, res, next) {
    try {
        // Verificar se o token está presente no cabeçalho Authorization
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verificar se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adicionar usuario decodificado ao objeto de requisição
        req.user = decoded;

        // Chamar o próximo middleware ou rota
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}

export default auth;