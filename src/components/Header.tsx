"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const { user, logout } = useUser();
  const { items } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // ✅ Close menus on route change
  useEffect(() => {
    setCartOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // ✅ Detect outside click for both user menu and cart
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        cartRef.current &&
        !cartRef.current.contains(target)
      ) {
        setMenuOpen(false);
        setCartOpen(false);
      }
    };
    if (menuOpen || cartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, cartOpen]);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold cursor-pointer">
        Ecommerce Light
      </Link>

      <nav className="space-x-4 flex items-center">
        {/* Cart Icon */}
        <div ref={cartRef} className="relative">
          <button
            onClick={() => setCartOpen((prev) => !prev)}
            className="relative cursor-pointer"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </button>

          {/* Cart Drawer */}
          {cartOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white text-black shadow-lg rounded-lg p-4 overflow-y-auto z-50">
              <h2 className="text-lg font-bold mb-2">Your Cart</h2>
              {items.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 pb-2">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 pt-2">
                    <p className="font-bold text-right mb-2">
                      Total: $
                      {items.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )}
                    </p>
                    <Link
                      href="/cart"
                      className="block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Go to Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold cursor-pointer"
            >
              {user.email?.charAt(0).toUpperCase()}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-bold text-sm">{user.email}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 cursor-pointer"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/auth/login" className="cursor-pointer hover:underline">
              Login
            </Link>
            <Link href="/auth/signup" className="cursor-pointer hover:underline">
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
