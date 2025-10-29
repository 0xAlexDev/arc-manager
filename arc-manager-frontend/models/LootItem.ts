export interface LootItem {
  id: number | undefined;
  imageB64: string;
  name: string;
  type: string;
  price: number;
  rarity: string;
  sellable: boolean;
  buyable: boolean;
  forHideout: boolean;
  forMission: boolean;
  forCrafting: boolean;
  priority: number;
  note?: string;
}
