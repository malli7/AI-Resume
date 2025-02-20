"use client";
import { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import Dashboard from "../components/Dashboard";
import Onboarding from "../components/Onboarding";

export default function Home() {
  const { user } = useUser();
  const [recordExists, setRecordExists] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkRecordExists = async () => {
      if (!user) return;
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (!userEmail) return;

      try {
        const resumesRef = collection(db, "resumes");
        const docRef = doc(resumesRef, userEmail);
        const docSnap = await getDoc(docRef);

        setRecordExists(docSnap.exists());
      } catch (error) {
        console.error("Error checking record:", error);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    checkRecordExists();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return recordExists ? <Dashboard /> : <Onboarding isEdit={false}/>;
}


