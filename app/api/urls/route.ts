import { pinata } from "@/utils/config";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const errors = {
  internalServerError: () =>
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
  invalidParams: () =>
    NextResponse.json(
      { message: "error. invalid parameters" },
      { status: 500 }
    ),
};

export async function POST(request: NextRequest) {
  try {
    const { cid } = await request.json();
    if (!cid) {
      return errors.invalidParams();
    }

    const url = await pinata.gateways.createSignedURL({
      cid,
      expires: 3600,
    });

    return NextResponse.json({ data: url }, { status: 200 });
  } catch (e) {
    console.log(e);
    return errors.internalServerError();
  }
}
