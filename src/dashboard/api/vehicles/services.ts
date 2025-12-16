"use server"
import { prisma } from "@/api/prisma";

type ServiceFrequencyResult = {
    _id: {
        date: string;
        fuelType: string;
    };
    count: number;
};
export async function getServiceFrequency(): Promise<ServiceFrequencyResult[]> {
    const vehicles = await prisma.vehicles.aggregateRaw({
        pipeline: [
            { $unwind: "$services" },
            {
                $addFields: { serviceDate: { $toDate: "$services.date" } }
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: { format: "%b", date: "$serviceDate" }
                        },
                        fuelType: "$fuel_type"
                    },
                    count: { $sum: 1 },
                    monthNumber: { $first: { $month: "$serviceDate" } }
                }
            },

            { $sort: { "monthNumber": -1 } },
            { $project: { monthNumber: 0 } }
        ]
    });
    return vehicles as unknown as ServiceFrequencyResult[];
}