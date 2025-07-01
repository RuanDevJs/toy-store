import { NextResponse } from "next/server";
import SalesRepository from "@/database/repositories/SalesRepository";
import { authenticateUser } from "../../auth/route";

export async function GET() {
    try {
        await authenticateUser();
        const repository = new SalesRepository();

        const calculateCustomerMostSales =
            await repository.calculateCustomerMostSales();
        const calculateAverageMostSales =
            await repository.calculateAverageMostSales();
        const calculateOneDaysSales = await repository.calculateOneDaysSales();
        return NextResponse.json({
            cliente_com_maior_vendas: calculateCustomerMostSales,
            cliente_com_maior_media_de_vendas: calculateAverageMostSales,
            cliente_com_maior_numero_de_dias_unicos_com_vendas_registradas:
                calculateOneDaysSales,
        });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message })
    }
}
