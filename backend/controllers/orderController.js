import Order from "../models/Order.js";
import Product from "../models/Product.js"
import User from "../models/User.js";


// global variables for payment
const currency = "usd"
const delivery_charges = 10 // 10 dollord


//place order useing COD [POST '/cod']
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body
        const { userId } = req.auth()

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Please add Product first" })
        }

        //calculate amount using items
        let subtotal = 0
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({ success: false, message: "Product not found" })
            }
            const uniPrice = product.price[item.size]//pick correct size first
            if (!uniPrice) {
                return res.json({ success: false, message: "Invalid size selected" })
            }

            subtotal += uniPrice * item.quantity
        }

        //calculate total amount by adding delivery charges
        const totalAmount = subtotal + delivery_charges

        const order = await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: "COD",
        })

        // clear user cart after placing order
        await User.findByIdAndUpdate(userId, { cartData: {} })

        return res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// place order using stripe [POST '/stripe']
export const placeOrderStripe = async (req, res) => {
    try {

    } catch (error) {

    }
}


// all orders data for the user [POST '/userorders']
export const userOrders = async (req, res) => {
    try {
        const { userId } = req.auth()
        const orders = await Order.find({ userId, $or: [{ paymentMethod: "COD" }, { isPaid: true }] }).populate('items.product address').sort({ createdAt: -1 })

        res.json({ success: true, orders })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }

}


// all orders data for the admin [POST '/']
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({ $or: [{ paymentMethod: "COD" }, { isPaid: true }] }).populate('items.product address').sort({ createdAt: -1 })

        const totalOrders = orders.length
        const totalRevenue = orders.reduce((acc, o) => acc + (o.isPaid ? o.amount : 0), 0)

        res.json({ success: true, dashboardData: { totalOrders, totalRevenue, orders } })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }
}


// update order status for the admin [POST '/status']
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await Order.findByIdAndUpdate(orderId, { status })

        res.json({ success: true, message: "Order status updated" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}