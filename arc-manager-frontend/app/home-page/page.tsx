"use client";

import { DiagonalPage } from "@/components/HomePageSections";
import SpaceHeader from "@/components/SpaceHeader";

export default function HomePage() {
  return (
    <div style={{ margin: 0, padding: 0, height: "100vh" }}>
      <SpaceHeader />
      <DiagonalPage backgroundImage="arc-loot.jpg"></DiagonalPage>
    </div>
  );
}