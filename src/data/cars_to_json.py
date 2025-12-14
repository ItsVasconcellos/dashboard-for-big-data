import csv
import json
from bson import ObjectId   
import datetime
csv_file = "CarSales_Dataset.csv"
cars_output = "output/cars.json"
dealers_output = "./output/dealers.json"

with open(csv_file, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    cars_map = {}
    dealers_map = {}
    for index,row in enumerate(reader):
        car_id = row['CarID']
        dealer_name = row["DealerName"]
        if dealer_name not in dealers_map:
            new_dealer = {
                "_id": str(ObjectId()),
                "name": dealer_name,
                "city": row["DealerCity"],
                "latitude": row["Latitude"],
                "longitude": row["Longitude"]
            }
            dealers_map[dealer_name] = new_dealer
            
        if car_id not in cars_map:
            new_car = {
                "_id": car_id,
                "manufacturer": row["Manufacturer"],
                "model": row["Model"],
                "engine_size": row["Engine size"],
                "features": [row["Features"]],
                "fuel_type": row["Fuel_Type"],
                "year": int(row["Year_of_Manufacturing"]),
                "mileage": int(row["Mileage"]),
                "price": int(row["Price"]),
                "dealer_id": dealers_map[dealer_name]["_id"]            
            }
            if row["AccidentID"] is not (None or ""):
                new_car["accidents"]=[{
                    "accident_id": row["AccidentID"],
                    "description": row["Description"],
                    "date": datetime.datetime.strptime(row["Date_of_Accident"], "%d/%m/%Y").isoformat(),
                    "repair_cost": int(row["Cost_of_Repair"]),
                    "severity": row["Severity"] 
                }]
            else:
                new_car["accidents"] = []
            if row["ServiceID"] is not (None or ""):
                new_car["services"]=[{
                    "service_id": row["ServiceID"],
                    "date": datetime.datetime.strptime(row["Date_of_Service"], "%d/%m/%Y").isoformat(),
                    "type": row["ServiceType"],
                    "cost": int(row["Cost_of_Service"])
                }]
            else:
                new_car["services"] = []
            cars_map[car_id] = new_car

        else:
            car = cars_map[car_id]
            
            feature = row["Features"]
            if feature not in car["features"]:
                car["features"].append(row["Features"])
            
            accident_id = row["AccidentID"]
            if accident_id is not (None or ""):
                if accident_id not in {a["accident_id"] for a in car["accidents"]} and accident_id != None:
                    new_accident = {
                        "accident_id": row["AccidentID"],
                        "date": datetime.datetime.strptime(row["Date_of_Accident"], "%d/%m/%Y").isoformat(),
                        "description": row["Description"],
                        "repair_cost": int(row["Cost_of_Repair"]),
                        "severity": row["Severity"] 
                    }
                    car["accidents"].append(new_accident)

            service_id = row["ServiceID"]
            if service_id is not (None or ""):
                if service_id not in {a["service_id"] for a in car["services"]} and service_id != None:
                    new_service = {
                        "service_id": row["ServiceID"],
                        "date": datetime.datetime.strptime(row["Date_of_Service"], "%d/%m/%Y").isoformat(),
                        "type": row["ServiceType"],
                        "cost": int(row["Cost_of_Service"])
                    }
                    car["services"].append(new_service)

cars_list = list(cars_map.values())
dealer_list = list(dealers_map.values())
# Write list of dictionaries to JSON file
with open(cars_output, "w", encoding='utf-8') as f:
    json.dump(cars_list, f, indent=2)

with open(dealers_output, "w", encoding='utf-8') as f:
    json.dump(dealer_list, f, indent=2)
