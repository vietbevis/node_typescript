import express from 'express'
import AuthRouter from './auth.route'

const routes_v1 = express.Router()

// Public routes
routes_v1.use('/auth', AuthRouter)

// Middleware check authenicated

// Private routes

export default routes_v1
