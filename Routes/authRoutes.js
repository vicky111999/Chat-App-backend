import express from 'express'
import { getAllUsers, login, register } from '../controller/authcontroller.js'
import { verifyToken } from '../middleware/authmiddleware.js'

const authRouter = express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.get('/getallusers',verifyToken,getAllUsers)

export default authRouter
