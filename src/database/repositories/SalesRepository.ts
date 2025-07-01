import { MongoError, ObjectId } from "mongodb";
import { DatabaseClient } from "../MongoClient";

interface ISalesCollection {
    _id: ObjectId;
    customer_id: ObjectId;
    data: string;
    valor: number;
}

export default class SalesRepository {
    async initDatabase() {
        try {
            const client = await DatabaseClient();
            const db = await client?.db(process.env.MONGO_DATABASE);
            return { client, db };
        } catch {
            throw new Error("Failed to establish connection to database");
        }
    }

    async calculateSalesPerDay() {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error("Could not connect on database!");

            const customers = await db
                .collection<ISalesCollection>("sales")
                .aggregate([
                    {
                        $group: {
                            _id: "$data",
                            totalVendas: {
                                $sum: {
                                    $toLong: "$valor",
                                },
                            },
                        },
                    },
                    {
                        $sort: {
                            _id: 1,
                        },
                    },
                ])
                .toArray();

            return customers;
        } catch (error) {
            if (error instanceof MongoError) throw new Error(error.message);
            else if (error instanceof MongoError) {
                throw new Error(error.message);
            }
        }
    }
    // O cliente com o maior volume de vendas
    async calculateCustomerMostSales() {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error("Could not connect on database!");

            const customers = await db
                .collection<ISalesCollection>("sales")
                .aggregate([
                    {
                        $group: {
                            _id: "$customer_id",
                            totalVendas: {
                                $sum: {
                                    $toLong: "$valor",
                                },
                            },
                        },
                    },
                    {
                        $sort: {
                            totalVendas: -1,
                        },
                    },
                    {
                        $limit: 1,
                    },
                    {
                        $lookup: {
                            from: "customers",
                            localField: "_id",
                            foreignField: "_id",
                            as: "cliente",
                        },
                    },
                    {
                        $unwind: {
                            path: "$cliente",
                        },
                    },
                ])
                .toArray();

            return customers;
        } catch (error) {
            if (error instanceof MongoError) console.error(error.message);
        }
    }

    // O cliente com a maior média de valor por venda
    async calculateAverageMostSales() {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error("Could not connect on database!");

            const customers = await db
                .collection<ISalesCollection>("sales")
                .aggregate([
                    {
                        $group: {
                            _id: "$customer_id",
                            totalVendas: {
                                $sum: {
                                    $toLong: "$valor",
                                },
                            },
                            qtdVendas: {
                                $sum: 1,
                            },
                        },
                    },
                    {
                        $addFields: {
                            averageSales: {
                                $divide: ["$totalVendas", "$qtdVendas"],
                            },
                        },
                    },
                    {
                        $sort: {
                            averageSales: -1,
                        },
                    },
                    {
                        $limit: 1,
                    },
                    {
                        $lookup: {
                            from: "customers",
                            localField: "_id",
                            foreignField: "_id",
                            as: "cliente",
                        },
                    },
                    {
                        $unwind: {
                            path: "$cliente",
                        },
                    },
                ])
                .toArray();

            return customers;
        } catch (error) {
            if (error instanceof MongoError) console.error(error.message);
        }
    }

    //
    async calculateOneDaysSales() {
        try {
            const { client, db } = await this.initDatabase();
            if (!client || !db)
                throw new Error("Could not connect on database!");

            const customers = await db
                .collection<ISalesCollection>("sales")
                .aggregate([
                    {
                        $project: {
                            customer_id: 1,
                            dia: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                        $dateFromString: {
                                            dateString: "$data",
                                            format: "%Y-%m-%d",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                customer_id: "$customer_id",
                                dia: "$dia",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.customer_id",
                            diasUnicos: { $sum: 1 },
                        },
                    },
                    {
                        $sort: { diasUnicos: -1 },
                    },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: "customers",
                            localField: "_id",
                            foreignField: "_id",
                            as: "cliente",
                        },
                    },
                    { $unwind: "$cliente" },
                ])
                .toArray();

            return customers;
        } catch (error) {
            if (error instanceof MongoError) console.error(error.message);
        }
    }
}
