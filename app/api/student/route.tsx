import { NextResponse, NextRequest } from "next/server";
import createStudentUser from "@/app/utils/createStudentUser";
import { getStudentData } from "@/app/utils/getStudent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getUserId } from "@/app/utils/getUserId";
import { updateStudent } from "@/app/utils/updateStudent";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const result = await getUserId(session?.user.email);
  const studentData = await getStudentData(result.id);
  return NextResponse.json(studentData, { status: result.status });
}

export async function POST(request: NextRequest) {
  const userData = await request.json();
  const result = await createStudentUser(userData);
  return NextResponse.json(result, { status: result.status });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const updateData = await request.json();
  const studentIdResponse = await getUserId(session?.user.email);
  const studentId = await studentIdResponse.id;
  const result = await updateStudent(studentId, updateData);
  return NextResponse.json(result, { status: result.status });
}
