"use client";

import React from "react";
import Image from "next/image";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  onRemove: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  price,
  imageUrl,
  quantity,
  onRemove,
  onIncrement,
  onDecrement,
}) => {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 transition rounded-lg">
      {/* Image */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{currency.format(price)}</p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => onDecrement(id)}
            className="p-1 rounded hover:bg-gray-200 transition"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="text-gray-700">{quantity}</span>
          <button
            onClick={() => onIncrement(id)}
            className="p-1 rounded hover:bg-gray-200 transition"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(id)}
        className="p-2 rounded-full hover:bg-red-100 transition"
        aria-label="Remove item"
      >
        <XMarkIcon className="w-5 h-5 text-red-500" />
      </button>
    </div>
  );
};

export default CartItem;
