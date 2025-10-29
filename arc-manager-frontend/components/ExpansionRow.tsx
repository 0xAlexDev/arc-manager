"use client";

import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionActions, Button, IconButton } from "@mui/material";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LootItem } from "@/models/LootItem";

interface ExpansionRowProps {
  item : LootItem
  onEdit: (id : Number) => void;
  onDelete: (id : Number) => void;
}

export default function ExpansionRow({
    item,
    onEdit,
    onDelete,
}: ExpansionRowProps) {

  return (
    <div style={{marginTop: "1%"}}>
      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
      <div style={{"display":"flex", alignItems:"center", justifyContent: "flex-start", width:"100%"}}>
        <div style={{"display":"flex", flexDirection:"column", marginLeft:"1%"}} onClick={(e) => e.stopPropagation()} >
        <IconButton aria-label="edit" color="info" onClick={() => onEdit(item.id!)}>
                <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" color="error" onClick={() => onDelete(item.id!)}>
                <DeleteIcon />
        </IconButton>
        </div>
        {/* Badge della priorità */}
  <div
    style={{
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#0088d1ff",
      color: "white",
      borderRadius: "50%",
      padding: "8px 8px",
      minWidth: 16,
      textAlign: "center",
      fontSize: 12,
      fontWeight: "bold",
      lineHeight: 1,
    }}
  >
    {item.priority}
  </div>
        <div
        className="w-[10%] flex justify-center"
        style={{ marginLeft: "5%" }}
        >
        <img
            src={item.imageB64}
            className="object-contain rounded-md"
            style={{
            maxWidth: "100px%",   // larghezza massima
            maxHeight: "100px",   // altezza massima (8vh ≈ 64px su schermo medio)
            width: "100px",
            height: "100px",
            }}
            alt={item.name}
        />
        </div>

        <div style={{display:"flex", flexDirection:"column", marginLeft: "5%"}}>
          <div style={{margin:5}} className="font-semibold">Name: {item.name}</div>
          <div style={{margin:5}} className="text-sm text-gray-600">Type: {item.type}</div>
          <div style={{margin:5}} className="text-sm text-gray-800">€ {item.price.toFixed(2)}</div>
        </div>

        <div style={{display:"flex", flexDirection:"column", marginLeft: "5%"}}>
          <div style={{margin:5}} className="font-semibold">Rarity: {item.rarity}</div>
          <div style={{margin:5}} className="text-sm text-gray-600">
            Saleable: {item.sellable ? "✅" : "❌"}
          </div>
          <div style={{margin:5}} className="text-sm text-gray-600">
            Purchasable: {item.buyable ? "✅" : "❌"}
          </div>
        </div>

          <div
        style={{
            width: "2px",
            backgroundColor: "#ccc",
            height: 100,
            margin: "0 16px",
            marginLeft:"5%"
        }}
        ></div>

        <div style={{display:"flex", flexDirection:"column", marginLeft: "5%",}}>
          <div style={{margin:5}} className="font-semibold">Needs to:</div>
         <div style={{margin:5}} className="text-sm text-gray-600">
            HIDEOUT: {item.forHideout ? "✅" : "❌"}
          </div>
          <div style={{margin:5}} className="text-sm text-gray-600">
            CRAFTING: {item.forCrafting ? "✅" : "❌"}
          </div>
            <div style={{margin:5}} className="text-sm text-gray-600">
            QUESTS: {item.forMission ? "✅" : "❌"}
          </div>
        </div>
      </div>
        </AccordionSummary>
        <AccordionDetails style={{display:"flex", alignItems:"flex-start", justifyContent:"flex-start"}}>
          <div style={{padding:"1%", marginTop:"2%"}}>
            <div style={{fontStyle:"italic"}}>NOTE:<br/><br/></div>
            <div style={{ whiteSpace: "pre-wrap" }}>
            {item.note}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
