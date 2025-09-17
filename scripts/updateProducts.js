// seedProducts.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  
  for (const docSnap of querySnapshot.docs) {
    await updateDoc(doc(db, "products", docSnap.id), {
      imageUrl: "https://placehold.co/400x400.png?text=Product+Image"
    });
    console.log(`Updated ${docSnap.id}`);
  }

  console.log("All products updated!");
}

updateProducts();