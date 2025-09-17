// seedProducts.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// 1️⃣ Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDGjuvvGtKT33757mn-dZm1chXmAzXo7AQ",
  authDomain: "ecommerce-light-6b249.firebaseapp.com",
  projectId: "ecommerce-light-6b249",
  storageBucket: "ecommerce-light-6b249.firebasestorage.app",
  messagingSenderId: "733418563422",
  appId: "1:733418563422:web:57d7c0ef2a5ec5593ad1cf",
  measurementId: "G-5LB25CKGEY"
};

// 2️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3️⃣ Function to add 100 products
async function seedProducts() {
  for (let i = 1; i <= 100; i++) {
    await addDoc(collection(db, "products"), {
      title: `Product ${i}`,
      description: `This is the description for product number ${i}`,
      price: Math.floor(Math.random() * 100) + 10, // random price 10-109
      imageUrl: `https://placehold.co/400x400.png?text=Product+Image`,
      category: `Category ${Math.ceil(i / 10)}` // 10 products per category
    });
    console.log(`Product ${i} added`);
  }
  console.log("All 100 products added!");
}

// Run the script
seedProducts();
