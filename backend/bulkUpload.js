import mongoose from "mongoose";
import "dotenv/config"
import { v2 as cloudinary } from "cloudinary"
import Product from "./models/Product.js"
import path from "path"
import { dirname } from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const dummyProducts = [

    {
        title: "Argan Hair Oil",
        images: ["product_1.png"],
        price: { "50ml": 15, "100ml": 25, "200ml": 40 },
        description:
            "Nourish your hair with our Argan Hair Oil, rich in vitamins for shiny and healthy locks. This lightweight formula absorbs quickly without leaving a greasy residue.",
        category: "Hair Care",
        type: "Oil",
        sizes: ["50ml", "100ml", "200ml"],
        popular: false,
        inStock: true,
    },

    {
        title: "Jojoba Face Oil",
        images: ["product_3.png"],
        price: { "30ml": 25, "50ml": 40, "100ml": 60 },
        description:
            "Balance your skin with our Jojoba Face Oil, ideal for all skin types with natural mimicking properties. It regulates sebum production while providing essential hydration.",
        category: "Face Care",
        type: "Oil",
        sizes: ["30ml", "50ml", "100ml"],
        popular: false,
        inStock: true,
    },
    {
        title: "Tea Tree Hair Oil",
        images: ["product_4.png"],
        price: { "50ml": 18, "100ml": 30, "200ml": 45 },
        description:
            "Purify your scalp with our Tea Tree Hair Oil, helping to reduce dandruff and promote growth. Its antimicrobial properties keep your scalp healthy and clean.",
        category: "Hair Care",
        type: "Oil",
        sizes: ["50ml", "100ml", "200ml"],
        popular: true,
        inStock: true,
    },
    {
        title: "Almond Body Oil",
        images: ["product_5.png"],
        price: { "100ml": 22, "200ml": 38, "400ml": 55 },
        description:
            "Soften your skin with our Almond Body Oil, enriched with vitamin E for nourishment. This gentle formula is perfect for sensitive skin and improves skin texture.",
        category: "Body Care",
        type: "Oil",
        sizes: ["100ml", "200ml", "400ml"],
        popular: false,
        inStock: true,
    },
    {
        title: "Rosehip Face Oil",
        images: ["product_6.png"],
        price: { "30ml": 28, "50ml": 45, "100ml": 65 },
        description:
            "Rejuvenate your complexion with our Rosehip Face Oil, packed with antioxidants for glowing skin. It helps reduce the appearance of fine lines and scars.",
        category: "Face Care",
        type: "Oil",
        sizes: ["30ml", "50ml", "100ml"],
        popular: false,
        inStock: true,
    },
    {
        title: "Castor Hair Oil",
        images: ["product_7.png"],
        price: { "50ml": 12, "100ml": 20, "200ml": 35 },
        description:
            "Strengthen your hair with our Castor Hair Oil, known for promoting thickness and shine. This rich formula helps prevent split ends and breakage.",
        category: "Hair Care",
        type: "Oil",
        sizes: ["50ml", "100ml", "200ml"],
        popular: false,
        inStock: true,
    },
    {
        title: "Lavender Body Oil",
        images: ["product_8.png"],
        price: { "100ml": 25, "200ml": 40, "400ml": 60 },
        description:
            "Relax your body with our Lavender Body Oil, offering calming aromatherapy benefits. Perfect for evening use to promote restful sleep and relaxation.",
        category: "Body Care",
        type: "Oil",
        sizes: ["100ml", "200ml", "400ml"],
        popular: false,
        inStock: true,
    },
    {
        title: "Vitamin C Face Oil",
        images: ["product_9.png"],
        price: { "30ml": 30, "50ml": 50, "100ml": 75 },
        description:
            "Brighten your skin with our Vitamin C Face Oil, helping to reduce dark spots and even tone. This antioxidant-rich formula protects against environmental damage.",
        category: "Face Care",
        type: "Oil",
        sizes: ["30ml", "50ml", "100ml"],
        popular: true,
        inStock: true,
    },
    {
        title: "Citrus Burst Perfume",
        images: ["product_10.png"],
        price: { "50ml": 40, "100ml": 60, "200ml": 85 },
        description:
            "Invigorate your senses with our Citrus Burst Perfume, featuring fresh lemon and orange notes. This energizing fragrance lasts throughout the day.",
        category: "Body Care",
        type: "Perfume",
        sizes: ["50ml", "100ml", "200ml"],
        popular: false,
        inStock: true,
    },
    {
        title: "Floral Dream Perfume",
        images: ["product_11.png"],
        price: { "50ml": 45, "100ml": 65, "200ml": 90 },
        description:
            "Embrace elegance with our Floral Dream Perfume, blending rose and jasmine essences. A timeless fragrance that's perfect for special occasions.",
        category: "Body Care",
        type: "Perfume",
        sizes: ["50ml", "100ml", "200ml"],
        popular: false,
        inStock: true,
    },
    {
        title: "Woody Spice Perfume",
        images: ["product_12.png"],
        price: { "50ml": 35, "100ml": 55, "200ml": 80 },
        description:
            "Discover depth with our Woody Spice Perfume, combining sandalwood and cinnamon. This warm, earthy scent is perfect for evening wear.",
        category: "Body Care",
        type: "Perfume",
        sizes: ["50ml", "100ml", "200ml"],
        popular: false,
        inStock: true,
    },

];

cloudinary.config({
    cloud_name: process.env.CLDN_NAME,
    api_key: process.env.CLDN_API_KEY,
    api_secret: process.env.CLDN_API_SECRET,
});

async function bulkUpload() {
    try {
        //connect to mongoDB
        await mongoose.connect(`${process.env.MONGO_URL}`);

        for (const prod of dummyProducts){
            //upload images to cloudinary
            const imagesUrl = await Promise.all(
                prod.images.map(async (fileName)=>{
                    const filePath = path.join(__dirname, "images", fileName);
                    const result = await cloudinary.uploader.upload(filePath, {
                        resource_type: "image",
                    });
                    return result.secure_url;
                })
            );

            //create product in DB
            await Product.create({
                title: prod.title,
                description: prod.description,
                price: prod.price,
                sizes: prod.sizes,
                images: imagesUrl,
                category: prod.category,
                type: prod.type,
                popular: prod.popular,
                inStock: prod.inStock,
            });

            console.log(`Uploaded: ${prod.title}`);
        }

        console.log("All products uploaded successfully!");
    } catch (err) {
        console.error("Error:", err.message);
    }finally{
        mongoose.disconnect();
    }
}

bulkUpload();
