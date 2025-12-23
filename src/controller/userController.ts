import { userService } from "../service/userService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number,
    adminflag?: 'T' | 'F'
}

export const userController ={
    async getAllUsers(req: auth, res: Response){
        try{
            if(!req.companyid){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }
            const user = await userService.getAllUsers(req.companyid)
            res.json(user)
        }catch(error){
            console.log(error)
            res.status(500).json({error: "Erro ao buscar usuários"})
        }
    },

    async createUser(req: auth, res: Response){
        try{
            const {email,password,name,adminflag} = req.body
            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(401).json({ error: "Usuário não autenticado." })
            }

            if (req.adminflag !== 'T') {
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem realizar o cadastro de outros usuários" })
            }

            if (!email || !password || !name) { 
                return res.status(400).json({ error: "Email, senha e nome são obrigatórios para o cadastro." })
            }

            const user = await userService.createUser({
                email,
                password,
                name,
                adminflag,
                companyid: req.companyid
            })
            res.status(201).json(user);
        } catch (error){
            console.log(error)
            res.status(500).json({ error: "Erro ao criar usuário" })
        }
    },

    async updateUser(req: auth, res: Response){
        try{
            const userIdUpdate = Number(req.params.userid)
            const userToUpdate = req.body

            if(!req.companyid || !req.userid || !req.adminflag){
                return res.status(400).json({ error: "Usuário não autenticado"})
            }

            if (req.adminflag !== 'T') {
                return res.status(403).json({ error: "Acesso negado. Apenas usuários ADMIN podem alterar campos de usuários" })
            }

            const user= await userService.updateUser(
                userIdUpdate, 
                userToUpdate, 
                req.companyid
            )
            res.status(200).json(user)
        } catch (error){
            console.log(error)
            res.status(500).json({ error: "Erro ao atualizar usuário" })
        }
    }
}