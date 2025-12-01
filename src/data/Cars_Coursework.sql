CREATE TYPE "AccidentSeverity" AS ENUM (
  'Minor',
  'Moderate',
  'Major',
  'Severe'
);

CREATE TYPE "FuelType" AS ENUM (
  'Petrol',
  'Hybrid',
  'Diesel'
);

CREATE TABLE "Cars" (
  "car_id" uuid PRIMARY KEY,
  "mileage" integer NOT NULL,
  "price" float NOT NULL,
  "model" uuid,
  "dealer_id" uuid
);

CREATE TABLE "Manufacturers" (
  "manufacturer_id" uuid PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "ManufacturersModels" (
  "manufacturer_model_id" uuid PRIMARY KEY,
  "model_name" text NOT NULL,
  "engine_size" float,
  "fuel_type" "FuelType" NOT NULL,
  "year_of_manufacturing" smallint NOT NULL,
  "manufacturer_id" uuid
);

CREATE TABLE "Features" (
  "feature_id" uuid PRIMARY KEY,
  "description" text NOT NULL
);

CREATE TABLE "Car_Features" (
  "car_feature_id" uuid PRIMARY KEY,
  "feature_id" uuid,
  "car_id" uuid
);

CREATE TABLE "Dealers" (
  "dealer_id" uuid PRIMARY KEY,
  "name" text NOT NULL,
  "latitude" float,
  "longitude" float,
  "city" text
);

CREATE TABLE "Services" (
  "service_id" uuid PRIMARY KEY,
  "date_of_service" date NOT NULL,
  "service_type" text,
  "cost" float,
  "car_id" uuid
);

CREATE TABLE "Accidents" (
  "accident_id" uuid PRIMARY KEY,
  "date_of_accident" date NOT NULL,
  "description" text,
  "repair_cost" float,
  "severity" "AccidentSeverity" NOT NULL,
  "car_id" uuid
);

ALTER TABLE "Cars" ADD FOREIGN KEY ("model") REFERENCES "ManufacturersModels" ("manufacturer_model_id");

ALTER TABLE "Cars" ADD FOREIGN KEY ("dealer_id") REFERENCES "Dealers" ("dealer_id");

ALTER TABLE "ManufacturersModels" ADD FOREIGN KEY ("manufacturer_id") REFERENCES "Manufacturers" ("manufacturer_id");

ALTER TABLE "Car_Features" ADD FOREIGN KEY ("feature_id") REFERENCES "Features" ("feature_id");

ALTER TABLE "Car_Features" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("car_id");

ALTER TABLE "Services" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("car_id");

ALTER TABLE "Accidents" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("car_id");
