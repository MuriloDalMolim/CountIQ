import { userService } from "../service/userService.js";
import type { Request, Response } from "express";

interface auth extends Request{
    companyid?: number,
    userid?: number
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
            const {email,password,name} = req.body
            if(!req.companyid){
                return res.status(401).json({ error: "Usuário não autenticado." });
            }

            if (!email || !password || !name) { 
                return res.status(400).json({ error: "Email, senha e nome são obrigatórios para o cadastro." });
            }

            const user = await userService.createUser({
                email,
                password,
                name,
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
            const useridUpdate = Number(req.params.userid)
            const userToUpdate = req.body

            if(!req.companyid){
                return res.status(400).json({ error: "Usuário não autenticado"})
            }

            const user= await userService.updateUser(useridUpdate, userToUpdate, req.companyid)
                res.json(user)
        } catch (error){
            console.log(error)
            res.status(500).json({ error: "Erro ao atualizar usuário" })
        }
    },

    async deleteUser(req: auth, res: Response){
        try{
            const useridDelete = Number(req.params.userid)

            if(!req.companyid || !req.userid){
                return res.status(401).json({error: "Usuário não autenticado"})
            }

            if(useridDelete === req.userid){
                return res.status(403).json({error: "Não é possível deletar o próprio cadastro"})
            }

            const user = await userService.deleteUser(useridDelete,req.companyid)
            res.status(200).json(user)
        } catch (error){
            console.log(error)
            res.status(500).json({ error: "Erro interno ao deletar usuário" })
        }
    }
}