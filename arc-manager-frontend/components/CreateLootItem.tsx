import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { LootItem } from "../models/LootItem";

interface LootItemDialogProps {
  open: boolean;
  initialItem?: LootItem;
  onClose: () => void;
  onSave: (item: LootItem) => void;
}

export const LootItemDialog: React.FC<LootItemDialogProps> = ({
  open,
  initialItem,
  onClose,
  onSave,
}) => {
  const [item, setItem] = useState<LootItem>({
    id: undefined,
    imageB64: "",
    name: "",
    type: "",
    price: 0,
    rarity: "",
    sellable: false,
    buyable: false,
    forHideout: false,
    forMission: false,
    forCrafting: false,
    priority: 0,
  });

  // Aggiorna lo stato quando cambia initialItem
  useEffect(() => {
    console.log("ITEM I")
    console.log(initialItem)
    if (initialItem) setItem(initialItem);
    else
      setItem({
        id: undefined,
        imageB64: "",
        name: "",
        type: "",
        price: 0,
        rarity: "",
        sellable: false,
        buyable: false,
        forHideout: false,
        forMission: false,
        forCrafting: false,
        priority: 0,
      });
  }, [initialItem]);

  const handleChange = (field: keyof LootItem, value: any) => {
    setItem((prev) => ({ ...prev, [field]: value }));
  };

  // Drag-and-drop image
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setItem((prev) => ({ ...prev, imageB64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSave = () => {
    onSave(item);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialItem ? "Edit Loot Item" : "New Loot Item"}</DialogTitle>

      <DialogContent
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div style={{marginTop:"1%"}}></div>
        <TextField
          label="Name"
          fullWidth
          value={item.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <TextField
          label="Type"
          fullWidth
          value={item.type}
          onChange={(e) => handleChange("type", e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Rarity</InputLabel>
          <Select
            value={item.rarity}
            onChange={(e) => handleChange("rarity", e.target.value)}
            label="Rarity"
          >
            <MenuItem value="Common">Common</MenuItem>
            <MenuItem value="Uncommon">Uncommon</MenuItem>
            <MenuItem value="Rare">Rare</MenuItem>
            <MenuItem value="Epic">Epic</MenuItem>
            <MenuItem value="Legendary">Legendary</MenuItem>
          </Select>
        </FormControl>

                <TextField
          label="Price"
          type="number"
          fullWidth
          value={item.price}
          onChange={(e) => handleChange("price", parseFloat(e.target.value))}
        />

        <TextField
          label="Priority"
          type="number"
          fullWidth
          value={item.priority}
          onChange={(e) => handleChange("priority", parseInt(e.target.value))}
        />

        <TextField
            label="Notes"
            fullWidth
            multiline
            minRows={6}       // altezza iniziale della textarea
            maxRows={12}      // altezza massima prima di mostrare lo scroll
            variant="outlined"
            value={item.note || ""}
            onChange={(e) => handleChange("note", e.target.value)}
            />

        {/* Drag & Drop Area */}
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #aaa",
            borderRadius: 2,
            padding: 2,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
          }}
        >
          <input {...getInputProps()} />
          <Typography>
            {isDragActive
              ? "Rilascia l'immagine qui..."
              : "Trascina qui un'immagine o clicca per selezionarla"}
          </Typography>
          {item.imageB64 && (
            <img
              src={item.imageB64}
              alt="Preview"
              style={{ width: 100, height: 100, marginTop: 8, objectFit: "contain" }}
            />
          )}
        </Box>

        {/* Checkbox in colonna */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControlLabel
            control={<Checkbox checked={item.sellable} onChange={(e) => handleChange("sellable", e.target.checked)} />}
            label="Sellable"
          />
          <FormControlLabel
            control={<Checkbox checked={item.buyable} onChange={(e) => handleChange("buyable", e.target.checked)} />}
            label="Buyable"
          />
        <FormControlLabel
            control={<Checkbox checked={item.forCrafting} onChange={(e) => handleChange("forCrafting", e.target.checked)} />}
            label="For Crafting"
          />
          <FormControlLabel
            control={<Checkbox checked={item.forHideout} onChange={(e) => handleChange("forHideout", e.target.checked)} />}
            label="For Hideout"
          />
        <FormControlLabel
            control={<Checkbox checked={item.forMission} onChange={(e) => handleChange("forMission", e.target.checked)} />}
            label="For Quest"
          />
        </Box>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
