import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Raw shape from GET /adoptable/showcase ─────────────────────────────────────

interface RawArtist {
  username: string;
  displayName: string;
  avatar: string;
  paymentMethodIcons: string[];
}

interface RawTag {
  name: string;
  color: string;
}

interface RawShowcaseItem {
  id: string;
  number: number;
  imageUrl: string;
  status: "open" | "close" | "resell";
  price: number;
  isNSFW: boolean;
  artist: RawArtist;
  tags: RawTag[];
}

// ── Handler ────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/adoptable/showcase`, {
      headers: { "ngrok-skip-browser-warning": "true" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { isSuccess: false, message: "Failed to fetch from backend" },
        { status: res.status }
      );
    }

    const json = await res.json();
    const rawItems: RawShowcaseItem[] = json?.data ?? [];

    const data = rawItems.map((item) => ({
      id: item.id,
      number: item.number,
      imageUrl: item.imageUrl,
      status: item.status,
      price: item.price,
      isNSFW: item.isNSFW,
      createdAt: "",
      artist: {
        username: item.artist.username,
        displayName: item.artist.displayName,
        profilePictureUrl: item.artist.avatar ?? null,
        paymentMethods: item.artist.paymentMethodIcons.map((iconUrl) => ({
          name: "",
          iconUrl,
          accountValue: "",
        })),
      },
      owner: {
        username: item.artist.username,
        displayName: item.artist.displayName,
        profilePictureUrl: item.artist.avatar ?? null,
      },
      tags: item.tags.map((tag) => ({
        name: tag.name,
        color: tag.color,
        category: { name: "", color: tag.color },
      })),
    }));

    return NextResponse.json({ isSuccess: true, data });
  } catch {
    return NextResponse.json(
      { isSuccess: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
