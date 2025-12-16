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
                            $dateToString: { format: "%Y-%m-%d", date: "$serviceDate" }
                        },
                        fuelType: "$fuel_type"
                    },
                    count: { $sum: 1 }
                }
            },

            { $sort: { "_id.date": -1 } },
            { $limit: 90 }
        ]
    });
    return vehicles as unknown as ServiceFrequencyResult[];
}