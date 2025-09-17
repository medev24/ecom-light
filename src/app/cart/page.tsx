"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    initialized,
  } = useCart();

  const [showModal, setShowModal] = useState(false);

  if (!initialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold">Loading cart...</p>
      </div>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleClearCart = () => setShowModal(true);
  const confirmClear = () => {
    clearCart();
    setShowModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-gray-600">
          <p className="mb-4">Your cart is empty.</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline font-medium"
          >
            Continue Shopping →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-gray-700 mb-4">Total items: {totalQuantity}</p>

          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <CartItem
                key={item.title}
                id={item.title}
                title={item.title}
                price={item.price}
                imageUrl={item.imageUrl}
                quantity={item.quantity}
                onRemove={removeFromCart}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <p className="font-bold text-lg">
              Total: {currency.format(totalPrice)}
            </p>
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              <TrashIcon className="w-5 h-5" />
              Clear Cart
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Clear Cart</h2>
            <p className="mb-4">Are you sure you want to clear your cart?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
