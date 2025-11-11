import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken"

declare global {
    namespace Express{
        interface Request{
            userid?: number
            companyid?: number
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    try{
        const authHeader = req.headers.authorization

        if(!authHeader){
            return res.status(401).json({ error: "Token de autenticação não fornecido." })
        }

        const parts = authHeader.split(" ")
        if(parts.length !==2 || parts[0] !== "Bearer"){
            return res.status(401).json({ error: "Token mal formatado." })
        }
        
        const token = parts[1]
        if (!token) {
            return res.status(401).json({ error: "Token não encontrado." });
        }

        const secret = process.env.JWT_SECRET
        if(!secret){
            throw new Error("Chave secreta JWT não configurada.")
        }

        const payload = jwt.verify(token, secret);
        req.userid = (payload as jwt.JwtPayload).userid
        req.companyid = (payload as jwt.JwtPayload).companyid
        next()
    }catch (error){
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Token inválido ou expirado." });
        }
        console.log(error)
        return res.status(500).json({ error: "Erro ao validar autenticação." })
    }
}