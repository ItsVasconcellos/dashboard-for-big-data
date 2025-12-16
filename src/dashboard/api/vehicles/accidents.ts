"use server"
import { prisma } from "@/api/prisma";

type AccidentSeverityResult = {
    severity: string;
    count: number;
};
export async function getAccidentSeverity(manufacturer?: string): Promise<AccidentSeverityResult[]> {
    const vehicles = await prisma.vehicles.aggregateRaw({
        pipeline: [
            { $match: { "manufacturer": { $eq: manufacturer } } },
            { $unwind: "$accidents" },
            { $group: { _id: "$accidents.severity", count: { $sum: 1 } } },
            { $project: { _id: 0, severity: "$_id", count: 1 } },
            { $sort: { severity: 1 } }
        ]
    });
    return vehicles as unknown as AccidentSeverityResult[];
}