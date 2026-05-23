export interface AuctionArtist {
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  paymentMethods?: { name: string; iconUrl: string; accountValue: string }[];
}

export interface AuctionTag {
  name: string;
  color: string;
}

export interface AuctionItem {
  id: string;
  number: number;
  imageUrl: string;
  thumbnailUrl?: string | null;
  postUrl?: string;
  status: "open" | "closed" | "sold";
  isNSFW?: boolean;
  startingBid: number;
  minIncrement: number;
  autoBuy: number | null;
  currentBid: number | null;
  bidCount: number;
  endTime: string;
  artist: AuctionArtist;
  tags: AuctionTag[];
  series: string;
}

export interface AuctionSeries {
  name: string;
  color: string;
  items: AuctionItem[];
}
