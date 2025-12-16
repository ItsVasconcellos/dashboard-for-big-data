"use server"
import { prisma } from "@/api/prisma";

export type SalesByCityResult = {
    name: string;
    totalValue: number;
};

export async function salesByCity(): Promise<SalesByCityResult[]> {
    const result = await prisma.vehicles.aggregateRaw({
        pipeline: [
            { $group: { _id: "$dealer_id", total_sales_value: { $sum: "$price" }, } },
            { $lookup: { from: "Dealers", localField: "_id", foreignField: "_id", as: "dealerDetails" } },
            { $unwind: "$dealerDetails" },
            { $group: { _id: "$dealerDetails.city", total_sales_value: { $sum: "$total_sales_value" } } },
            { $project: { _id: 0, name: "$_id", total_sales_value: 1 } },
            { $sort: { total_sales_value: 1 } },
            { $limit: 10 }
        ]
    });

    return result as unknown as SalesByCityResult[];
}