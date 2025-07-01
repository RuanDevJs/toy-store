import { MongoError, ObjectId } from "mongodb";
import { DatabaseClient } from "../MongoClient";

interface ICustomerCollection {
    _id: ObjectId;
    name: string;
    email: string;
}

export type filterOptions = "email" | "name" | "id";

export type ISavePayload = Omit<ICustomerCollection, "_id">;

export type IUpdatePayload = Partial<ISavePayload>;

export default class CustomersRepository {
    async initDatabase() {
        try {
            const client = await DatabaseClient();
            const db = await client?.db(process.env.MONGO_DATABASE);
            return { client, db };
        } catch {
            throw new Error("Failed to establish connection to database");
        }
    }

    async findAll(filterOptions?: filterOptions) {
        try {
            const pipeline = [
                {
                    $lookup: {
                        from: "sales",
                        localField: "_id",
                        foreignField: "customer_id",
                        as: "sales",
                    },
                },
            ];
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error(
                    "Error on find all customers - Could not connect on database!"
                );

            const customers = await db
                .collection<ICustomerCollection>("customers")
                .aggregate(pipeline);

            if (filterOptions) {
                return customers.sort({ [filterOptions]: 1 }).toArray();
            }
            return await customers.sort({ _id: 1 }).toArray();
        } catch (error) {
            if (error instanceof MongoError)
                console.error("Error on find all customers - ", error.message);
        }
    }

    async findByCustomerId(id: string) {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error(
                    "Error on find customers - Could not connect on database!"
                );

            const customer = await db
                .collection<ICustomerCollection>("customers")
                .findOne({ _id: new ObjectId(id) });
            return customer;
        } catch (error) {
            if (error instanceof MongoError)
                console.error("Error on find customer by id - ", error.message);
        }
    }

    async save(payload: ISavePayload) {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error(
                    "Error on save customers - Could not connect on database!"
                );

            await db
                .collection<ISavePayload>("customers")
                .insertOne(payload, { forceServerObjectId: true });
        } catch (error) {
            if (error instanceof MongoError)
                console.error("Error on save customers - ", error.message);
        }
    }

    async update(id: string, payload: IUpdatePayload) {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error(
                    "Error on update customers - Could not connect on database!"
                );

            await db
                .collection<ISavePayload>("customers")
                .findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: { ...payload } }
                );
        } catch (error) {
            if (error instanceof MongoError)
                console.error("Error on update customer - ", error.message);
        }
    }

    async delete(id: string) {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error(
                    "Error on delete customers - Could not connect on database!"
                );

            await db
                .collection<ISavePayload>("customers")
                .findOneAndDelete({ _id: new ObjectId(id) });
        } catch (error) {
            if (error instanceof MongoError)
                console.error("Error on update customer - ", error.message);
        }
    }
}
