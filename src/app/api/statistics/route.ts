import { NextResponse } from "next/server";
import SalesRepository from "@/database/repositories/SalesRepository";
import { authenticateUser } from "../auth/route";

export async function GET() {
    await authenticateUser();
    const repository = new SalesRepository();

    const rows = await repository.calculateSalesPerDay();
    return NextResponse.json({ total_sales_per_day: rows });
}
