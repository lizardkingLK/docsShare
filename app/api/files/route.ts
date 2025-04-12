import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/utils/config";

const errors = {
  internalServerError: () =>
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
  invalidParams: () =>
    NextResponse.json(
      { message: "error. invalid parameters" },
      { status: 500 }
    ),
  notFound: () =>
    NextResponse.json({ message: "error. not found" }, { status: 404 }),
};

export async function GET(request: NextRequest) {
  try {
    const groupId = request.nextUrl.searchParams.get("groupId");
    if (!groupId) {
      return errors.invalidParams();
    }

    const files = await pinata.files.public.list().group(groupId);
    if (!files) {
      return errors.internalServerError();
    }

    return NextResponse.json({ data: files.files }, { status: 200 });
  } catch (error) {
    console.log(error);
    return errors.notFound();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const signedURL = await pinata.upload.public.createSignedURL({
      expires: 3600,
    });
    const response = await pinata.upload.public.file(file).url(signedURL);
    if (!response?.id) {
      return errors.internalServerError();
    }

    return NextResponse.json(signedURL, { status: 200 });
  } catch (e) {
    console.log(e);
    return errors.internalServerError();
  }
}
