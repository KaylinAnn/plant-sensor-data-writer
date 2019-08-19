drop table if exists moisture;
drop table if exists temp;
drop table if exists plants;

create table plants (
id serial primary key,
nickname text,
proper_name text not null,
device text
);

create table moisture(
id serial primary key,
value int not null,
date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
plant_id int,
foreign key (plant_id) REFERENCES plants(id)
);

create table temp(
id serial primary key,
value int not null,
date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
plant_id int,
foreign key (plant_id) REFERENCES plants(id)
);