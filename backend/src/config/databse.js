import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";


const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log("[Database] : Connected to the database successfully.");
    } catch (error) {
        console.error("[Database] : Failed to connect to the database.", error);
        process.exit(1); // Exit the process with an error code
    }
}

export { prisma };