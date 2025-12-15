"use server"
import { prisma } from "@/api/prisma";

export async function getVehicles() {
    return await prisma.vehicle.findMany()
}
