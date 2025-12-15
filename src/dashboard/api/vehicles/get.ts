"use server"
import { prisma } from "@/api/prisma";

export async function getVehicles(offset?: number) {
    const vehicles = await prisma.vehicles.findMany({});
    return vehicles;
}