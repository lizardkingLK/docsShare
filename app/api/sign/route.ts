import { type NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export const dynamic = "force-dynamic";

const errors = {
  internalServerError: () =>
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const file: File | null = data.get("file") as unknown as File;
    const signedURL = await pinata.upload.public.createSignedURL({
      expires: 3600,
    });
    const response = await pinata.upload.public.file(file).url(signedURL);
    if (!response?.id) {
      return errors.internalServerError();
    }

    return NextResponse.json(signedURL, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: "Error creating API Key:" },
      { status: 500 }
    );
  }
}
