import transporter from "../config/nodemailer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import stripe from "stripe";

// Global variables for payment
const currency = "lkr";
const delivery_charges = 10; // LKR 10 delivery charge
const MINIMUM_ORDER_AMOUNT = 180; // Stripe requires ~LKR 180 minimum (~$0.50)

// Place Order using COD [POST '/cod']
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const { userId } = req.auth();

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Please add a product first." });
        }

        // Calculate subtotal
        let subtotal = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.json({ success: false, message: "Product not found." });

            const unitPrice = product.price[item.size];
            if (!unitPrice) return res.json({ success: false, message: "Invalid size selected." });

            subtotal += unitPrice * item.quantity;
        }

        const totalAmount = subtotal + delivery_charges;

        // Create order
        const order = await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: "COD",
        });

        // Clear cart
        await User.findByIdAndUpdate(userId, { cartData: {} });

        // Send confirmation email
        const populatedOrder = await Order.findById(order._id).populate("items.product address");
        const user = await User.findById(userId);

        const productTitles = populatedOrder.items
            .map((item) => item.product?.title || "Unknown")
            .join(", ");
        const addressString = populatedOrder.address
            ? `${populatedOrder.address.street || "N/A"}, ${populatedOrder.address.city || "N/A"}, ${populatedOrder.address.state || "N/A"}, ${populatedOrder.address.country || "N/A"}`
            : "No address";

        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: "Order Details (COD)",
            html: `
                <h2>Your Delivery Details</h2>
                <p>Thank you for your order! Below are your order details:</p>
                <ul>
                    <li><strong>Order ID:</strong> ${populatedOrder._id}</li>
                    <li><strong>Products:</strong> ${productTitles}</li>
                    <li><strong>Address:</strong> ${addressString}</li>
                    <li><strong>Total Amount:</strong> Rs ${populatedOrder.amount}</li>
                </ul>
                <p>You will receive your delivery in 1 day. Please pay upon delivery.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Order placed successfully (COD)." });
    } catch (error) {
        console.error("COD Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// Place Order using Stripe [POST '/stripe']
export const placeOrderStripe = async (req, res) => {
    try {
        const { items, address } = req.body;
        const { userId } = req.auth();
        const { origin } = req.headers;

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Please add a product first." });
        }

        let subtotal = 0;
        let productData = [];

        // Calculate subtotal and prepare product data
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.json({ success: false, message: "Product not found." });

            const unitPrice = product.price[item.size];
            if (!unitPrice) return res.json({ success: false, message: "Invalid size selected." });

            subtotal += unitPrice * item.quantity;

            productData.push({
                name: product.title,
                price: unitPrice,
                quantity: item.quantity,
            });
        }

        const totalAmount = subtotal + delivery_charges;

        // Stripe minimum amount check (LKR 180)
        if (totalAmount < MINIMUM_ORDER_AMOUNT) {
            return res.json({
                success: false,
                message: `Stripe requires a minimum order total of LKR ${MINIMUM_ORDER_AMOUNT}. Please add more items to your cart.`,
            });
        }

        // Create order in DB
        const order = await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: "stripe",
        });

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Prepare line items for Stripe Checkout
        let line_items = productData.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100), // LKR in cents
            },
            quantity: item.quantity,
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charges" },
                unit_amount: Math.round(delivery_charges * 100),
            },
            quantity: 1,
        });

        // Create Stripe Checkout Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/processing/my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get all user orders [POST '/userorders']
export const userOrders = async (req, res) => {
    try {
        const { userId } = req.auth();
        const orders = await Order.find({
            userId,
            $or: [{ paymentMethod: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("User Orders Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get all orders for admin [POST '/']
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentMethod: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce(
            (acc, o) => acc + (o.isPaid ? o.amount : 0),
            0
        );

        res.json({ success: true, dashboardData: { totalOrders, totalRevenue, orders } });
    } catch (error) {
        console.error("Admin Orders Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// order status for admin [POST '/status']
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });

        res.json({ success: true, message: "Order status updated successfully." });
    } catch (error) {
        console.error("Update Status Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};
