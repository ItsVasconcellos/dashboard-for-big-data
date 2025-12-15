"use server"
import { prisma } from "@/api/prisma";

export async function getDealers() {
    const vehicles = await prisma.dealers.findMany({});
    return vehicles;
}