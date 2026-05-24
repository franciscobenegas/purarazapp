import { NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { getDashboardStats, defaultStats } from "@/lib/dashboard";

export async function GET() {
  try {
    const user = getUserFromToken();

    if (!user) {
      return NextResponse.json(defaultStats);
    }

    const stats = await getDashboardStats(user.establesimiento);

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);

    return NextResponse.json(defaultStats);
  }
}
