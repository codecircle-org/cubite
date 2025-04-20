import { NextResponse, NextRequest } from "next/server";
import { getPage } from "@/app/utils/getPage";
import { updatePage } from "@/app/utils/updatePage";

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const result = await getPage(id);
  if (result.status === 200) {
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json(result);
  }
}

export async function PUT(request: NextRequest) {
  const pageData = await request.json();
  const result = await updatePage(pageData);
  return NextResponse.json(result, { status: result.status });
}
