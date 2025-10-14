import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Object, required: true },
    sizes: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, required: true },
    type: { type: String, required: true },
    populer: { type: Boolean, required: false },
    inStock: { type: Boolean, required: false },
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema)

export default Product