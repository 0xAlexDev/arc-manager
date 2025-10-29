import React, { useState } from "react";
import { Box } from "@mui/material";

interface SlantedVerticalBandsProps {
  images: string[]; // array di 3 immagini
}

export const SlantedVerticalBands: React.FC<SlantedVerticalBandsProps> = ({ images }) => {
  const [alarm, setAlarm] = useState([false, false, false]);

  if (images.length !== 3) {
    console.error("Devi fornire esattamente 3 immagini!");
    return null;
  }

  const handleClick = (index: number) => {
    const newAlarm = [...alarm];
    newAlarm[index] = !newAlarm[index];
    setAlarm(newAlarm);
    console.log(`Allarme banda ${index + 1}:`, newAlarm[index]);
  };

  const bandStyle = (image: string, index: number) => ({
    flex: 1,
    height: "100vh",
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transform: "skewY(-10deg)", // inclinazione abbattuta
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative" as const,
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      transform: "skewY(-10deg) translateY(-15px) scale(1.05)",
      zIndex: 10,
    },
    border: alarm[index] ? "3px solid yellow" : "none",
  });

  // invertiamo l'ordine delle immagini se necessario
  const reversedImages = [...images].reverse();

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      {reversedImages.map((img, i) => (
        <Box key={i} sx={bandStyle(img, i)} onClick={() => handleClick(i)} />
      ))}
    </Box>
  );
};
