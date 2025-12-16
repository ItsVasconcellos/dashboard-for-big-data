// 1. List all cars sold by each dealer, showing the number of cars sold and the total sales value per dealer.
db.Vehicles.aggregate([{$group: { _id: "$dealer_id", total_sales_value: { $sum: "$price" }, cars_sold: { $sum: 1 }}},
  {$lookup: {from: "Dealers", localField: "_id", foreignField: "_id", as: "dealerDetails"}},
  { $unwind: "$dealerDetails" },
  { $project: { _id: 0, dealer_id: "$_id", name: "$dealerDetails.name",cars_sold: 1,total_sales_value: 1}},
  { $sort: {name:1}}])
  
// 2. Calculate the average selling price by manufacturer and year of manufacturing.    
db.Vehicles.aggregate([
  {
    $group: {
      _id: { manufacturer: "$manufacturer", year: "$year" },
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $sort: { "_id.manufacturer": 1, "_id.year": 1 }
  }
]);
// 3. Find all cars that have been involved in more than two accidents. 
db.Vehicles.find({$where:"this.accidents.length > 2"});

// 4. Identify the most common service types performed in the last two years. 
var twoYearsAgo = new Date();
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
db.Vehicles.aggregate([
  { $unwind: "$services" },
  {
    $addFields: {
      serviceDate: { $toDate: "$services.date" }
    }
  },
  { 
    $match: { 
       "serviceDate": { $gte: twoYearsAgo } 
    } 
  },
  {
    $group: {
      _id: { type: "$services.type" },
      count: { $sum: 1 }
    }
  },
  {
    $sort:{count: -1},
  }
]);

// 5. Find all cars with a total accident repair cost exceeding £2,000, listing total cost and number of incidents. 
db.Vehicles.aggregate([
  {
    $addFields: {
      totalRepairCost: { $sum: "$accidents.repair_cost" },
      numberOfIncidents: { $size: "$accidents" } 
    }
  },
    {
    $match:{
      totalRepairCost: {$gt:2000}
    }
  },
  {
    $project:{
      _id:1, 
      totalRepairCost:1,
      numberOfIncidents:1
    }
  },
  {
    $sort:{
      totalRepairCost:-1
    }
  }
]);

// 6. Calculate the average mileage per fuel type and engine size category (e.g., <1.5L, 1.5–2.5L, >2.5L). 
db.Vehicles.aggregate([
  {
    $group:{
      _id: {
        "engineSize": "$engine_size",
      	"fuelType": "$fuel_type"
      },
      averageMileage: {$avg: "$mileage"}
    }
  },
  {
    $sort: {
      "_id.engineSize": 1
    }
  }
]);

// 7. Retrieve the full accident and service history for a specific car (by CarID). 
db.Vehicles.findOne()

// 8. List all cars older than 10 years that have undergone more than two services. 
db.Vehicles.aggregate([
  {
    $addFields:{
      servicesCount: {$size: "$services" }
    }
  },
  {
    $match:{ "year": {$lte: 2015}, "servicesCount": {$gte:2} }
  },
  {
    $project:{
      _id:1,
      servicesCount:1,
      year:1,
      price:1,
    }
  },{
    $sort:{
      "servicesCount": -1
    }
  }
]);

// 9. What is the distribution of cars by fuel type, and how does the average selling price vary across different fuel types? 
db.Vehicles.aggregate([
  {
    $group:{
      _id: {
        "fuelType": "$fuel_type"
      },
      averagePrice: {$avg: "$price"},
      quantity: { $sum: 1}
    }
  },
  {
    $sort: {
      "_id.fuelType": 1
    }
  }
]);

// 10. Find the top 3 dealers with the highest ratio of accident-prone cars to total cars sold. 
db.Vehicles.aggregate([{$group: { _id: "$dealer_id", totalAccidents: { $sum: {$cond: {
            if: { $gt: [{ $size: "$accidents" }, 0] },
            then: 1,
            else: 0
          }}}, cars_sold: { $sum: 1 }}},
  {$lookup: {from: "Dealers", localField: "_id", foreignField: "_id", as: "dealerDetails"}},
  { $unwind: "$dealerDetails" },
  {$addFields:{
    accidentProneRatio: {$divide: ["$totalAccidents", "$cars_sold"]}
  }},
  { $project: { _id: 0, dealer_id: "$_id", name: "$dealerDetails.name",cars_sold: 1, totalAccidents: 1, }},
  {$limit:3},  
	{ $sort: {name:1}}])

// 11. Identify the most profitable manufacturer based on total sales minus average repair costs per car. 

// 12. Compare the service frequency trend (number of services per year) across the last five years. 
db.Vehicles.aggregate([
  { $unwind: "$services" },
  {
    $addFields: {
      serviceDate: { $toDate: "$services.date" }
    }
  },
  {
    $addFields: {
      year: { $year: "$serviceDate" }
    }
  },
  {
    $group: {
      _id: "$year",
      TotalSerivces: {$sum: 1}
    }
  },
  {
    $sort:{
      _id: 1
    }
  }
])

// 13. Find cars that have not been serviced in the last 24 months but have recorded accidents in the same period. 
var twoYearsAgo = new Date();
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
db.Vehicles.aggregate([
  {
    $addFields: {
      recentAccidents: {
        $filter: {
          input: "$accidents",
          as: "acc",
          cond: {
            $gte: ["$$acc.date", twoYearsAgo]
          }
        }
      }
    }
  },
  {
    $addFields: {
      numberOfServices: { $size: "$services" },
      numberOfIncidents: { $size: "$accidents" } 
    }
  },
  {
    $match: {
      "numberOfServices": {$eq: 0},
      "numberOfIncidents": {$gt: 0}
    }
  },
  { $sort: {"numberOfIncidents": -1}},
  { $project: {
      _id: 1,
      numberOfIncidents: 1, 
      numberOfServices: 1
    }}
])

// 14. Compare the severity distribution of accidents (e.g., Minor, Moderate, Major) across all cars, grouped by manufacturer. 
db.Vehicles.aggregate([
  {$unwind: "$accidents"},
  {
    $group: {
    	_id: {"manufacturer": "$manufacturer", "severity": "$accidents.severity"},
  		totalAccidents: {$sum: 1}
    }
  },
  {$sort: {"_id.manufacturer":1}}
])

// 15. Identify the most common features among cars priced above £25,000.
db.Vehicles.aggregate([{$match:{'price': {$gt:25000}}},{$unwind:'$features'},{$group:{_id:"$features", count:{$sum:1}}}])

