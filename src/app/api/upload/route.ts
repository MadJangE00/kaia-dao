import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Upload image to IPFS
    const imageUpload = await pinata.upload.public.file(file).name(file.name);
    const imageUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${imageUpload.cid}`;

    // 2. Upload metadata JSON to IPFS
    const metadata = {
      name: name || file.name,
      description: description || "",
      image: imageUrl,
    };
    const metadataUpload = await pinata.upload.public
      .json(metadata)
      .name(`${name || "nft"}-metadata.json`);

    const metadataUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${metadataUpload.cid}`;

    return NextResponse.json({
      imageUrl,
      metadataUrl,
      imageCid: imageUpload.cid,
      metadataCid: metadataUpload.cid,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
