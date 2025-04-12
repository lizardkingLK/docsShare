import { pinata } from "@/utils/config";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const errors = {
  invalidParams: () =>
    NextResponse.json(
      { message: "error. invalid parameters" },
      { status: 500 }
    ),
  notFound: () =>
    NextResponse.json({ message: "error. not found" }, { status: 404 }),
};

export async function POST() {
  const { id } = (await currentUser())!;
  if (!id) {
    return errors.invalidParams();
  }

  const { groups } = await pinata.groups.public.list();
  let userGroup = groups.find((g) => g.name === id);
  if (!userGroup) {
    userGroup = await pinata.groups.public.create({
      name: id,
      isPublic: false,
    });
  }

  return NextResponse.json({ data: userGroup }, { status: 200 });
}
