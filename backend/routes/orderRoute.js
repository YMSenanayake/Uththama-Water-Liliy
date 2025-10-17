import express from "express"
import { allOrders, placeOrderCOD, placeOrderStripe, updateStatus, userOrders } from "../controllers/orderController.js"
import authUser from "../middleware/authMiddleware.js"



const orderRouter = express.Router()

// for Admin
orderRouter.get('/', authUser, allOrders)
orderRouter.post('/status', authUser, updateStatus)
// for payment
orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post('/stripe', authUser, placeOrderStripe)
// for user
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter