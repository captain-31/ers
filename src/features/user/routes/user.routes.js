import express from 'express'
import jwt from 'jsonwebtoken'
import { 
    getIndex, 
    postLogin, 
    getRegister, 
    postRegister,
    getDashboard,
    getAllUsers,
    getEditUser,
    postEditUser,
    deleteUser,
    logout,
    getUserDashboard
} from '../controller/user.controller.js'
import jwtAuth from '../../../middlewares/jwt.middleware.js'


const userRouter = express.Router()

// user routes
userRouter.get('/', getIndex)
userRouter.post('/', postLogin)
userRouter.get('/user/dashboard', jwtAuth, getUserDashboard)

// admin routes
userRouter.get('/admin/user/add', jwtAuth, getRegister)
userRouter.post('/admin/user/add', jwtAuth, postRegister)
userRouter.get('/admin/user/all', jwtAuth, getAllUsers)
userRouter.get('/admin/user/edit/:id', jwtAuth, getEditUser)
userRouter.post('/admin/user/edit/:id', jwtAuth, postEditUser)
userRouter.get('/admin/user/delete/:id', jwtAuth, deleteUser)


userRouter.get('/admin/dashboard', jwtAuth, getDashboard)
userRouter.get('/logout', logout)



export default userRouter