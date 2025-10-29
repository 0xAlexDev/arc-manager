"use client";

import { LootItemDialog } from "@/components/CreateLootItem";
import ExpansionRow from "@/components/ExpansionRow";
import SpaceHeader from "@/components/SpaceHeader";
import { LootItem } from "@/models/LootItem";
import { LootItemService } from "@/services/LootItemService";
import AddIcon from '@mui/icons-material/Add';
import { Chip, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function LootPage() {
  const lootItemService : LootItemService = LootItemService.getInstance();
  const [searchText, setSearchText] = useState("");
  const [tipSelected,setTipSelected] = useState("ALL");
  const [sortBy,setSortBy] = useState("PRI");
  const [itemToShow, setItemToShow] = useState([] as LootItem[])
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialItem, setInitialItem] = useState<LootItem | undefined>(undefined);

  useEffect(() => {
    handleItemListEvent()
  }, [tipSelected, searchText, sortBy]);

  useEffect(() => {
    const subscription = lootItemService.lootItemsChanged.subscribe(() => {
      console.log("refesh")
      setTipSelected("ALL")
      setSortBy("PRI")
      setSearchText("")
      handleItemListEvent();
    });

    handleItemListEvent();

    return () => subscription.unsubscribe();
  },[])


  async function handleItemListEvent(){
    let item : LootItem[] = await handleSearchEvent(tipSelected, searchText);
    let itemSorted : LootItem[] = [];
    console.log(sortBy)
    if(sortBy === "PRI")
      itemSorted = item.sort((i1, i2) => i2.priority - i1.priority);
    else if(sortBy === "PDC")
      itemSorted = item.sort((i1, i2) => i2.price - i1.price);
    else if(sortBy === "PCR")
      itemSorted = item.sort((i1, i2) => i1.price - i2.price);
    else if(sortBy === "TYP")
      itemSorted = groupAndSortByType(item)

    console.log(itemSorted)

    setItemToShow(itemSorted);
  }

function groupAndSortByType(items: LootItem[]): LootItem[] {
  const groups: Record<string, LootItem[]> = {};

  items.forEach((item) => {
    // Usa il type in lowercase per raggruppare
    const t = (item.type || "Unknown").toLowerCase();

    if (!groups[t]) groups[t] = [];
    groups[t].push(item);
  });

  // Ordina ogni gruppo per name (case-insensitive)
  Object.keys(groups).forEach((type) => {
    groups[type].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  });

  // Ricostruisci l'array ordinato: gruppi ordinati alfabeticamente (case-insensitive)
  const sortedItems: LootItem[] = [];
  Object.keys(groups)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .forEach((type) => {
      sortedItems.push(...groups[type]);
    });

  return sortedItems;
}
  

  function handleTipEvent(filterKey : string, itemToFilter : LootItem[] ){
    if(filterKey == "COM"){
      return itemToFilter.filter(item => item.rarity == "Common");
    }
    else if(filterKey == "UOM"){
      return itemToFilter.filter(item => item.rarity == "Uncommon");
    }
    else if(filterKey == "RAR"){
      return itemToFilter.filter(item => item.rarity == "Rare");
    }
    else if(filterKey == "EPC"){
      return itemToFilter.filter(item => item.rarity == "Epic");
    }
    else if(filterKey == "LEG"){
      return itemToFilter.filter(item => item.rarity == "Legendary");
    }
    else if(filterKey == "FCR"){
      return itemToFilter.filter(item => item.forCrafting == true);
    }
    else if(filterKey == "FHI"){
      return itemToFilter.filter(item => item.forHideout == true);
    }
    else if(filterKey == "FQT"){
      return itemToFilter.filter(item => item.forMission == true);
    }

    return itemToFilter;

  }

  function handleSearchFieldEvent(text : string, itemToFilter : LootItem[]){
    return text?.length > 0 ? itemToFilter.filter(item => item.name.toLowerCase().includes(text.toLowerCase())) : itemToFilter;
  }

  async function handleSearchEvent(tipSelected : string, searchText : string){
    let filteredItem : LootItem[] = await lootItemService.getAll();

    filteredItem = handleTipEvent(tipSelected, filteredItem)!;

    filteredItem = handleSearchFieldEvent(searchText, filteredItem)!;

    return filteredItem;
  }


  const handleSave = (item: LootItem) => {
    console.log(item)
    if (item.id != undefined) {
      console.log("edit")
      lootItemService.edit(item)
    } else {
      console.log("add")
      lootItemService.add(item)
    }
  };

  const handleEdit = (item: LootItem) => {
    setInitialItem(item)
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setInitialItem(undefined)
    setDialogOpen(true);
  };

    const handleDelete = (item: LootItem) => {
      console.log(item)
      lootItemService.delete(item.id!)
  };

  return (
    <div style={{margin:0, padding:0}}>
      <SpaceHeader></SpaceHeader>
      <div style={{display:"flex",alignItems:"center", justifyContent:"center",marginTop: "3%"}}> 
        <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(event) => {
          setSearchText(event.target.value)
        }}/>
      </div>
      <div style={{display:"flex",alignItems:"center", justifyContent:"center",marginTop: "2%"}}> 
        <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "ALL" ? 'blue' : "transparent",
           color: tipSelected == "ALL" ? 'white' : "black"
        }} label="All" onClick={() => {
          setTipSelected("ALL");
        }} />
        <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "COM" ? 'blue' : "transparent",
           color: tipSelected == "COM" ? 'white' : "black"
        }} label="Common" onClick={() => {
          setTipSelected("COM");
        }} />
                <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "UOM" ? 'blue' : "transparent",
           color: tipSelected == "UOM" ? 'white' : "black"
        }} label="Uncommon" onClick={() => {
          setTipSelected("UOM");
        }} />
        <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "RAR" ? 'blue' : "transparent",
           color: tipSelected == "RAR" ? 'white' : "black"
        }} label="Rare" onClick={() => {
          setTipSelected("RAR");
        }} />
        <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "EPC" ? 'blue' : "transparent",
           color: tipSelected == "EPC" ? 'white' : "black"
        }} label="Epic" onClick={() => {
          setTipSelected("EPC");
        }} />
        <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "LEG" ? 'blue' : "transparent",
           color: tipSelected == "LEG" ? 'white' : "black"
        }} label="Legendary" onClick={() => {
          setTipSelected("LEG");
        }} />
        <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "FCR" ? 'blue' : "transparent",
           color: tipSelected == "FCR" ? 'white' : "black"
        }} label="For Crafting" onClick={() => {
          setTipSelected("FCR");
        }} />
                <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "FHI" ? 'blue' : "transparent",
           color: tipSelected == "FHI" ? 'white' : "black"
        }} label="For Hideout" onClick={() => {
          setTipSelected("FHI");
        }} />
        <Chip style={{marginLeft:"1%",
           backgroundColor: tipSelected == "FQT" ? 'blue' : "transparent",
           color: tipSelected == "FQT" ? 'white' : "black"
        }} label="For Quest" onClick={() => {
          setTipSelected("FQT");
        }} />
        <div
        style={{
            width: "2px",
            backgroundColor: "#ccc",
            height: 30,
            marginLeft: "1%",
        }}
        ></div>
        <Chip style={{marginLeft:"1%",
          backgroundColor: sortBy == "PRI" ? 'orange' : "transparent",
          color: sortBy == "PRI" ? 'white' : "black"}} label="Priority" onClick={() => {
          setSortBy("PRI");
          }} />
                     <Chip style={{marginLeft:"1%",
           backgroundColor: sortBy == "TYP" ? 'orange' : "transparent",
           color: sortBy == "TYP" ? 'white' : "black"}} label="Type" onClick={() => {
            setSortBy("TYP");
           }} />
        <Chip style={{marginLeft:"1%",
          backgroundColor: sortBy == "PDC" ? 'orange' : "transparent",
          color: sortBy == "PDC" ? 'white' : "black"}} label="Prezzo DC" onClick={() => {
          setSortBy("PDC");
          }} />
        <Chip style={{marginLeft:"1%",
           backgroundColor: sortBy == "PCR" ? 'orange' : "transparent",
           color: sortBy == "PCR" ? 'white' : "black"}} label="Prezzo CR" onClick={() => {
            setSortBy("PCR");
           }} />

      </div>
      <div style={{display:"flex",alignItems:"center", justifyContent:"center",marginTop: "1%"}}> 
        <IconButton aria-label="add" color="success" onClick={() => handleAdd()}>
        <AddIcon />
      </IconButton>
      </div>
      <div style={{ padding: "16px", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
      {itemToShow.map((item, index) => (
        <div key={index} style={{width:"80%"}}>
          <ExpansionRow
          key={index}
          item={item}
          onEdit={async (id: Number) => handleEdit((await lootItemService.getAll()).find(item => item.id == id)!)}
          onDelete={async (id: Number) => handleDelete((await lootItemService.getAll()).find(item => item.id == id)!)}
        />
        </div>
      ))}
    </div>
      <LootItemDialog
        key={initialItem?.id ?? Math.random()}
        open={dialogOpen}
        onClose={() => {
          setInitialItem(undefined)
          setDialogOpen(false);
        }}
        initialItem={initialItem}
        onSave={(item) => handleSave(item)}
      />
    </div>
  );
}
