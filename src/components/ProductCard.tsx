// src/components/ProductCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  imageUrl,
}) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg p-4 flex flex-col items-center">
      <Image
        src={imageUrl}
        alt={title}
        width={192} // 48*4, roughly same as w-48
        height={192} // 48*4
        className="object-cover mb-2 rounded"
      />
      <h2 className="font-bold text-lg text-center">{title}</h2>
      <p className="text-gray-600 text-sm text-center line-clamp-2">{description}</p>
      <p className="font-semibold mt-2">${price}</p>
      <Link
        href={`/product/${id}`}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        View
      </Link>
    </div>
  );
};

export default ProductCard;
