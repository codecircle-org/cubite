import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getSiteData } from "@/app/utils/getSiteData";
import { createSite } from "@/app/utils/createSite";
import { updateSite } from "@/app/utils/updateSite";
import { deleteSite } from "@/app/utils/deleteSite";

interface Props {
  params: { domainName: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  let email;
  if (request.headers.get("Authorization")) {
    email = request.headers.get("Authorization");
  } else {
    const session = await getServerSession(authOptions);
    email = session?.user.email;
  }
  const site = await getSiteData(params.domainName, email);

  return NextResponse.json(site);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const result = await createSite(request, session?.user.email);
  return NextResponse.json(result, { status: result.status });
}

export async function PUT(request: NextRequest) {
  const { siteId, updateData } = await request.json();
  const result = await updateSite(siteId, updateData);
  return NextResponse.json(result, { status: result.status });
}

export async function DELETE(request: NextRequest) {
  const { domainName } = await request.json();
  if (!domainName) {
    return NextResponse.json({
      status: 400,
      message: "Domain name is required",
    });
  }
  const result = await deleteSite(domainName);
  return NextResponse.json(result, { status: result.status });
}
