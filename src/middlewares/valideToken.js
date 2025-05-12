import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// Middleware para validar el token de acceso
// Este middleware se encarga de verificar si el token de acceso es válido y si el usuario está autenticado
export const authRequire = (req, res, next) => {
    
    const {token}= req.cookies;
    if(!token) return res.status(401).json({message: "no token, authorization denied"});
    
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if(err) return res.status(401).json({message: "invalid token"});
        
        req.user = user
        next();
    });

    
}