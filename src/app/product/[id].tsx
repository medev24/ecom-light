"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

type Props = {
  params: { id: string };
};

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { user } = useUser();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [params.id]);

  // Add product to cart (guest or user)
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });

    alert(`${product.title} added to cart 🛒`);
  };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={400}
            height={400}
            className="rounded"
          />
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold mb-6">${product.price}</p>
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
        <Link href="/" className="block mt-6 text-blue-500 underline">
          ← Back to Products
        </Link>
      </main>
      <Footer />
    </div>
  );
}
