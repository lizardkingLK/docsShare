import { pinata } from "@/utils/config";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const errors = {
  internalServerError: () =>
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
  invalidParams: () =>
    NextResponse.json(
      { message: "error. invalid parameters" },
      { status: 500 }
    ),
};

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get("groupId");
  if (!groupId) {
    return errors.invalidParams();
  }
  
  try {
    const url = await pinata.upload.public.createSignedURL({
      groupId,
      expires: 3600,
    });

    return NextResponse.json({ url }, { status: 200 }); // Returns the signed upload URL
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: "Error creating API Key:" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cid } = await request.json();
    if (!cid) {
      return errors.invalidParams();
    }

    const url = await pinata.gateways.private.createAccessLink({
      cid,
      expires: 3600,
    });

    return NextResponse.json({ data: url }, { status: 200 });
  } catch (e) {
    console.log(e);
    return errors.internalServerError();
  }
}
