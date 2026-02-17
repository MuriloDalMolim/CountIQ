import { userService } from "../service/userService.js";
import type { Request, Response } from "express";
import { AppError } from "../utilities/AppError.js";

interface auth extends Request{
    companyId?: number,
    userId?: number,
    isAdmin?: boolean
}

export const userController ={

    async getUserById(req: auth, res: Response){
        try{
            const authUserId = Number(req.params.userId)

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            const user = await userService.getUserById(
                authUserId, 
                req.companyId)

            return res.json(user)    
        } catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            return res.status(500).json({ error: "Erro ao buscar usuário." })
        }
    },

    async getAllUsers(req: auth, res: Response){
        try{
            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!req.isAdmin){
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem visualizar o cadastro de outros usuários" })
            }

            const user = await userService.getAllUsers(req.companyId)
            
            return res.json(user)
        }catch(error){
            console.log(error)
            res.status(500).json({error: "Erro ao buscar usuários"})
        }
    },

    async createUser(req: auth, res: Response){
        try{
            const {email,password,name,isAdmin} = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if(!req.isAdmin){
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem realizar o cadastro de outros usuários" })
            }

            if(!email || !password || !name){ 
                return res.status(400).json({ error: "Email, senha e nome são obrigatórios para o cadastro." })
            }

            const user = await userService.createUser({
                email,
                password,
                name,
                isAdmin,
                companyId: req.companyId
            })

            return res.status(201).json(user)
        } catch (error){
            console.log(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }

            res.status(500).json({ error: "Erro ao criar usuário" })
        }
    },

    async updateUser(req: auth, res: Response){
        try{
            const userIdUpdate = Number(req.params.userId)
            const { email, name, password, isInactive, isAdmin } = req.body

            if(!req.companyId || !req.userId){
                return res.status(401).json({ error: "Usuário não autenticado"})
            }

            if (!req.isAdmin) {
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem alterar campos de usuários" })
            }

            const user= await userService.updateUser(
                userIdUpdate, 
                { email, name, password, isInactive, isAdmin },
                req.companyId
            )
            res.status(200).json(user)
        } catch (error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            console.log(error)
            res.status(500).json({ error: "Erro ao atualizar usuário" })
        }
    }
}