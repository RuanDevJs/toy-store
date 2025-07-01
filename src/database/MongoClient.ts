import { MongoClient, MongoClientOptions } from "mongodb";

export async function DatabaseClient(){
    const URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;

    try{
        const options: MongoClientOptions = {};

        if (!URI || URI.includes("undefined")) throw new Error("Please add your MONGO URI to connect to database!");

        const client = new MongoClient(URI, options);
        const clientPromise = await client.connect();
        return clientPromise;
    }catch(error){
        if(error instanceof Error) console.error("Error on connect database - ", error.message);

    }
}
