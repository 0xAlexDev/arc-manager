"use client"; // necessario se usi useEffect

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home-page"); // redirect alla home
  }, [router]);

  return null; // non serve renderizzare nulla
}
