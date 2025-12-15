// api/prisma.ts (or wherever you define your data function)
"use server"
import { prisma } from "@/api/prisma";

export async function getVehicles() {
    const vehicles = await prisma.vehicles.findMany();
    return vehicles;
}