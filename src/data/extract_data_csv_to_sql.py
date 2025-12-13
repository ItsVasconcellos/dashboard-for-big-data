import csv
import uuid
from pathlib import Path
from datetime import datetime

csv_file = "CarSales_Dataset.csv"
output_dir = Path("output")
output_dir.mkdir(exist_ok=True)

manufacturer = {}
manufacturer_models = {}
dealer = {}
features = {}
car = {}
car_features = {}
services = {}
accidents = {}

with open(csv_file, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for index,row in enumerate(reader):
        manufacturer_name = row["Manufacturer"]
        if manufacturer_name not in manufacturer:
            new_manufacturer = {
                "manufacturer_id": uuid.uuid4(),
                "name": row["Manufacturer"],
            }
            manufacturer[manufacturer_name]= new_manufacturer
        
        manufacturer_model_key = f'{manufacturer_name}|{row["Model"]}|{row['Engine size']}'
        if manufacturer_model_key not in manufacturer_models:
            new_manufacturer_model = {
                "manufacturer_model_id": uuid.uuid4(),
                "model_name": row["Model"],
                "engine_size": row["Engine size"],
                "fuel_type": row["Fuel_Type"],
                "year_of_manufacturing": int(row["Year_of_Manufacturing"]),
                "manufacturer_id": manufacturer[manufacturer_name]["manufacturer_id"]
            }
            manufacturer_models[manufacturer_model_key] = new_manufacturer_model

        dealer_name = row["DealerName"]
        if dealer_name not in dealer:
            dealer_id = uuid.uuid4()
            new_dealer = {
                "dealer_id": dealer_id,
                "name": dealer_name,
                "city": row["DealerCity"],
                "latitude": row["Latitude"],
                "longitude": row["Longitude"]
            }
            dealer[dealer_name] = new_dealer
            
        feature_description = row["Features"]
        if feature_description not in features:
            new_feature = {
                "feature_id":uuid.uuid4(),
                "description": feature_description
            }
            features[feature_description] = new_feature
        
        car_id = row['CarID']
        if car_id not in car:
            dealer_id = dealer[dealer_name]["dealer_id"]
            model_id = manufacturer_models[manufacturer_model_key]["manufacturer_model_id"]
            new_car = {
                "car_id": uuid.uuid4(),
                "mileage": int(row["Mileage"]),
                "price": int(row["Price"]),
                "model_id": model_id,
                "dealer_id": dealer_id,
            }
            car[car_id] = new_car

        car_feature_key = f'{car_id}|{feature_description}'
        if car_feature_key not in car_features:
            new_car_feature = {
                "car_feature_id": uuid.uuid4(),
                "car_id": car[car_id]["car_id"],
                "feature_id": features[feature_description]["feature_id"]
            }
            car_features[car_feature_key] = new_car_feature

        accident_id = row["AccidentID"]
        if accident_id not in accidents and accident_id not in (None or ""):
            new_accident = {
                "accident_id": uuid.uuid4(),
                "date_of_accident": datetime.strptime(row["Date_of_Accident"], "%d/%m/%Y").strftime("%Y-%m-%d"),
                "description": row["Description"],
                "repair_cost": row["Cost_of_Repair"],
                "severity": str(row["Severity"]).capitalize(),
                "car_id": car[car_id]["car_id"]
            }
            accidents[accident_id] = new_accident
        
        service_id = row["ServiceID"]
        if service_id not in services and service_id not in (None or ""):
            new_service = {
                "service_id": uuid.uuid4(),
                "date_of_service": datetime.strptime(row["Date_of_Service"], "%d/%m/%Y").strftime("%Y-%m-%d"),
                "service_type": row["ServiceType"],
                "cost": row["Cost_of_Service"],
                "car_id": car[car_id]["car_id"]   
            }
            services[service_id] = new_service



def write_csv(filename, fieldnames, rows):

    with open(output_dir / filename, "w", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

write_csv("Manufacturers.csv", ["manufacturer_id", "name"], list(manufacturer.values()))
write_csv("ManufacturerModels.csv", [
    "manufacturer_model_id",
    "model_name",
    "engine_size",
    "fuel_type",
    "year_of_manufacturing",
    "manufacturer_id"
], list(manufacturer_models.values()))
write_csv("Dealers.csv", ["dealer_id", "name", "city", "latitude", "longitude"], list(dealer.values()))
write_csv("Features.csv", ["feature_id", "description"], list(features.values()))
write_csv("Cars.csv", ["car_id", "mileage", "price", "model_id", "dealer_id"], list(car.values()))
write_csv("CarFeatures.csv", ["car_feature_id", "car_id", "feature_id"], list(car_features.values()))
write_csv("Services.csv", ["service_id", "date_of_service", "service_type", "cost", "car_id"], list(services.values()))
write_csv("Accidents.csv", ["accident_id", "date_of_accident", "description", "repair_cost", "severity", "car_id"], list(accidents.values()))