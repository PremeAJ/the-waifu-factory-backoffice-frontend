export interface CommissionArtist {
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  paymentMethods?: { name: string; iconUrl: string; accountValue: string }[];
}

export interface CommissionTag {
  name: string;
  color: string;
}

export interface CommissionPost {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  postUrl?: string;
  isNSFW: boolean;
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;
  price?: number;
  createdAt: string;
  artist: CommissionArtist;
  owner?: CommissionArtist;
  tags?: CommissionTag[];
}

export interface CommissionOpenSlot {
  id: string;
  title: string;
  description?: string;
  maxSlots: number;
  price?: number;
  status: "open" | "closed";
  currentSlots: number;
  createdAt: string;
  artist: CommissionArtist;
}
