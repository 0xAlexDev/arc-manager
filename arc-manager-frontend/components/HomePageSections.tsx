"use client";


import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface DiagonalPageProps {
  backgroundImage: string;
}

export const DiagonalPage: React.FC<DiagonalPageProps> = ({ backgroundImage }) => {

const router = useRouter();

  const handleClick = (route : string) => {
    router.push(route);
  };
  
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Testo centrale */}
      <Typography
        sx={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "3rem" },
          textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        Resource management
      </Typography>

      {/* Sezioni diagonali */}
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Sezione 1 (superiore, più grande) */}
        <Box
          sx={{
            flex: 1.2, // più grande
            clipPath: "polygon(0 100%, 0% 0%, 100% 0%, 100% 33%)",
            backgroundColor: "rgba(0,200,200,0.5)",
            cursor: "not-allowed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": { opacity: 1 },
          }}
          onClick={() => null}
        >
          <Typography         sx={{
          position: "absolute",
          top: "15%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "3rem" },
          textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
        }}>
            Character
          </Typography>
        </Box>

        {/* Sezione 2 (centrale, più piccola) */}
        <Box
          sx={{
            flex: 0.8, // più piccola
            clipPath: "polygon(0 0%, 0 100%, 100% 66%, 100% 0%)",
            backgroundColor: "rgba(200,0,200,0.5)",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": { opacity: 0.8 },
          }}
          onClick={() => handleClick("/loot-page")}
        >
        </Box>

        {/* Sezione 3 (inferiore, più grande) */}
        <Box
          sx={{
            flex: 1.2, // più grande
            clipPath: "polygon(0 0%, 0 100%, 100% 100%, 100% 66%)",
            backgroundColor: "rgba(200,200,0,0.5)",
            cursor: "not-allowed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": { opacity: 1 },
          }}
          onClick={() => null}
        >
          <Typography         sx={{
          position: "absolute",
          top: "81%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "3rem" },
          textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
        }}>
            Statistics
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
