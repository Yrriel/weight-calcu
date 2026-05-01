CREATE DATABASE "pernWeightItems";

CREATE TABLE "all_items"(
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255),
    item_variation VARCHAR(255),
    item_weight NUMERIC(1000,0)
);