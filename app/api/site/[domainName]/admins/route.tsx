import { NextRequest, NextResponse } from "next/server";
import { addSiteAdmin } from "@/app/utils/addSiteAdmin";
import { deleteSiteAdmin } from "@/app/utils/deleteSiteAdmin";

interface Props {
  params: { domainName: string };
}

interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
}

export async function POST(request: NextRequest, { params }: Props) {
  const domainName = params.domainName;
  const body = await request.json();
  const result = await addSiteAdmin(
    body.siteId,
    body.username,
    body.name,
    body.email
  );
  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const result = await deleteSiteAdmin(body.siteId, body.userId);
  return NextResponse.json(result);
}
