import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { DatabaseClient } from "@/database/MongoClient";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

interface IPayload {
    email: string;
    password: string;
}

interface IUser {
    _id: ObjectId;
    email: string;
    password: string;
}

async function initDatabase() {
    try {
        const client = await DatabaseClient();
        const db = await client?.db(process.env.MONGO_DATABASE);
        return { client, db };
    } catch {
        throw new Error("Failed to establish connection to database");
    }
}

export async function authenticateUser() {
    const cookiesHandler = await cookies();
    const token = cookiesHandler.get("@toy-store:auth-token");

    if (token === undefined) throw new Error("User is not authenticated");

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!);

    if (!decoded) throw new Error("User is not authenticated");
}

export async function POST(request: NextRequest) {
    try {
        const cookiesHandler = await cookies();

        const SECRET_KEY = process.env.JWT_SECRET!;
        const payload = (await request.json()) as IPayload;

        if (!payload.email || !payload.password)
            throw new Error("Missing payload email or password");

        const { db } = await initDatabase()!;

        const authenticatedUser = await db
            ?.collection<IUser>("users")
            .findOne({ email: payload.email });

        if (!authenticatedUser) throw new Error("User not found");

        const validatePassword = await bcrypt.compare(
            payload.password,
            authenticatedUser.password
        );

        if (!validatePassword) throw new Error("Email or password not found!");

        const token = jwt.sign({ sub: authenticatedUser._id }, SECRET_KEY, {
            expiresIn: "1h",
        });

        cookiesHandler.set("@toy-store:auth-token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
        });
        return NextResponse.json({ token }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
