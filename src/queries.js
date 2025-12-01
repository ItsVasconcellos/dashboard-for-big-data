// 1. List all cars sold by each dealer, showing the number of cars sold and the total sales value per dealer.
db.Vehicles.aggregate([{$group: { _id: "$dealer_id", total_sales_value: { $sum: "$price" }, cars_sold: { $sum: 1 }}},
  {$lookup: {from: "Dealers", localField: "_id", foreignField: "_id", as: "dealerDetails"}},
  { $unwind: "$dealerDetails" },
  { $project: { _id: 0, dealer_id: "$_id", name: "$dealerDetails.name",cars_sold: 1,total_sales_value: 1}},
  { $sort: {name:1}}])
// 2. Calculate the average selling price by manufacturer and year of manufacturing.    

// 3. Find all cars that have been involved in more than two accidents. 
db.Vehicles.find({$where:"this.accidents.length > 2"});

// 15. Identify the most common features among cars priced above £25,000.
db.Vehicles.aggregate([{$match:{'price': {$gt:25000}}},{$unwind:'$features'},{$group:{_id:"$features", count:{$sum:1}}}])

