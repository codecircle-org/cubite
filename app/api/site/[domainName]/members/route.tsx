import { NextRequest, NextResponse } from "next/server";
import { addSiteMember } from "@/app/utils/addSiteMember";
import { deleteSiteMember } from "@/app/utils/deleteSiteMember";
import { updateMemberRole } from "@/app/utils/updateMemberRole";

export async function POST(request: NextRequest) {
  const { siteId, username, name, email, role } = await request.json();

  if (!siteId || !username || !name || !email || !role) {
    return NextResponse.json(
      {
        status: 400,
        message: "Missing required fields",
      },
      { status: 400 }
    );
  }

  const result = await addSiteMember(siteId, username, name, email, role);

  return NextResponse.json(result, { status: result.status });
}

export async function DELETE(request: NextRequest) {
  const { userId, siteId } = await request.json();

  const result = await deleteSiteMember(userId, siteId);
  return NextResponse.json(result, { status: result.status });
}

export async function PATCH(request) {
  const { userId, newRole, siteId } = await request.json();
  const result = await updateMemberRole(userId, siteId, newRole);
  return NextResponse.json(result, { status: result.status });
}
