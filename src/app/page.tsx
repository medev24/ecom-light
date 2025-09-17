"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface Product {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push(doc.data() as Product);
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products.");
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    // Only pass the fields CartContext needs
    addToCart({
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1, // CartContext will handle increment
    });
    toast.success(`${product.title} added to cart!`, { duration: 3000 });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product, idx) => (
        <div
          key={idx}
          className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition"
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="mb-3 w-full h-48 object-cover rounded-lg"
          />
          <h2 className="font-bold text-lg">{product.title}</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="font-semibold text-blue-600 text-lg">${product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
