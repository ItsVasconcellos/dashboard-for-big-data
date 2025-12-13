--  1. List all cars sold by each dealer, showing the number of cars sold and the total sales value per dealer
Select c.dealer_id, Sum(c.price), count(c.car_id), d."name" from public."Cars" c join "Dealers" d on c.dealer_id = d.dealer_id group by c.dealer_id, d."name" order by d."name"

-- 2. Calculate the average selling price by manufacturer and year of manufacturing.    
select ROUND(AVG(c.price)::numeric,1), m."name", mm.year_of_manufacturing from "Manufacturers" m join "ManufacturersModels" mm on mm.manufacturer_id = m.manufacturer_id
join "Cars" c on c.model_id = mm.manufacturer_model_id
group by m."name", mm.year_of_manufacturing
order by m."name", mm.year_of_manufacturing 

-- 3. Find all cars that have been involved in more than two accidents. 
select c.car_id, COUNT(a.accident_id) as "Total Accidents" from "Cars" c inner join "Accidents" a on c.car_id = a.car_id group by c.car_id having COUNT(a.accident_id) >= 2;

-- 4. Identify the most common service types performed in the last two years. 
select s.service_type, COUNT(s.service_type ) from "Services" s where s.date_of_service > now() - interval '2 years' group by s.service_type order by COUNT(s.service_type) desc;
 
-- 5. Find all cars with a total accident repair cost exceeding £2,000, listing total cost and number of incidents. 
select SUM(a.repair_cost), a.car_id, c.price  from "Accidents" a inner join "Cars" c on c.car_id = a.car_id group by a.car_id, c.car_id having SUM(a.repair_cost) > 2000;
 
-- 6. Calculate the average mileage per fuel type and engine size category (e.g., <1.5L, 1.5–2.5L, >2.5L). 
select AVG(c.mileage ), mm.engine_size, mm.fuel_type from "ManufacturersModels" mm full join "Cars" c on c.model_id = mm.manufacturer_model_id group by mm.engine_size, mm.fuel_type order by mm.engine_size 
 
-- 7. Retrieve the full accident and service history for a specific car (by CarID). 
select a, s from "Cars" c inner join "Services" s on s.car_id = c.car_id full join "Accidents" a on a.car_id = c.car_id where a.car_id = '48c4994c-2fc6-41ea-8d96-40f4b32edf1f' or s.car_id = '48c4994c-2fc6-41ea-8d96-40f4b32edf1f'
 
-- 8. List all cars older than 10 years that have undergone more than two services. 
select count(s.car_id), s.car_id, c.mileage, c.price from "Cars" c 
full join "ManufacturersModels" mm on mm.manufacturer_model_id = c.model_id 
inner join "Services" s on s.car_id = c.car_id 
where mm.year_of_manufacturing <= 2015 group by s.car_id, c.car_id having count(s.car_id) > 2 order by count(s.car_id) desc
 
-- 9. What is the distribution of cars by fuel type, and how does the average selling price vary across different fuel types? 
select count(c.car_id) as "Car Distribution", avg(c.price), mm.fuel_type from "Cars" c inner join "ManufacturersModels" mm on mm.manufacturer_model_id = c.model_id group by mm.fuel_type

 
-- 10. Find the top 3 dealers with the highest ratio of accident-prone cars to total cars sold. 
select d.dealer_id, d."name", Count(distinct a.car_id )*1.0/Count(distinct c.car_id) as "Accident Ratio" from "Dealers" d   
inner join "Cars" c on c.dealer_id = d.dealer_id 
left join "Accidents" a on a.car_id = c.car_id 
group by d.dealer_id order by "Accident Ratio" desc limit 3 
 

-- 11. Identify the most profitable manufacturer based on total sales minus average repair costs per car. 
 

-- 12. Compare the service frequency trend (number of services per year) across the last five years. 
select Count(s.service_id), extract(year from s.date_of_service) as year from "Services" s 
where s.date_of_service  > now() - interval '5 years' group by extract(year from s.date_of_service) order by extract(year from s.date_of_service) 

 
-- 13. Find cars that have not been serviced in the last 24 months but have recorded accidents in the same period. 
select c.car_id, count(a.accident_id), count(s.service_id) from "Cars" c full join "Accidents" a on a.car_id = c.car_id 
left join  "Services" s on c.car_id = s.car_id 
where a.date_of_accident > now() - interval '2 years' or s.date_of_service > now() - interval '2 years'
group by c.car_id having count(a.accident_id) > 0 and count(s.service_id) <= 0
 
-- 14. Compare the severity distribution of accidents (e.g., Minor, Moderate, Major) across all cars, grouped by manufacturer. 
select count(a.severity ), a.severity, m."name" from "Manufacturers" m inner join "ManufacturersModels" mm on mm.manufacturer_id = m.manufacturer_id   
full join "Cars" c on c.model_id = mm.manufacturer_model_id 
left join "Accidents" a on c.car_id = a.car_id
where a.severity is not null
group by m."name" , a.severity
order by m."name", a.severity

-- 15. Identify the most common features among cars priced above £25,000.
select Count(cf.car_feature_id) as Cars, f.description from "Features" f join "Car_Features" cf on cf.feature_id = f.feature_id
join "Cars" c on c.car_id = cf.car_id
where c.price > 25000
group by f.description