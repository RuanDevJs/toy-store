import CustomersRepository, {
    IUpdatePayload,
} from "@/database/repositories/CustomersRepository";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../auth/route";

interface IContext {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, context: IContext) {
    const repository = new CustomersRepository();
    const params = await context.params;

    try {
        await authenticateUser();
        const rows = await repository.findByCustomerId(params.id);
        return NextResponse.json({ cliente: rows }, { status: 200 });
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, context: IContext) {
    const repository = new CustomersRepository();
    const params = await context.params;
    const payload = (await request.json()) as IUpdatePayload;

    try {
        await authenticateUser();
        await repository.update(params.id, payload);
        return NextResponse.json({ updated: true }, { status: 200 });
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: IContext) {
    const repository = new CustomersRepository();
    const params = await context.params;

    try {
        await authenticateUser();

        if (request.headers.get("origin") === "cypress") {
            repository.deleteByEmail("cypres-teste-@nextjs.com")
            return NextResponse.json({ deleted: true }, { status: 200 });
        }

        await repository.delete(params.id);
        return NextResponse.json({ deleted: true }, { status: 200 });
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
