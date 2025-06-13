create database videojuegos;
use videojuegos;

create table videojuegos (
    id bigint auto_increment primary key,
    titulo varchar(255),
    director varchar(255),
    categoria_id int,
    precio decimal(38,2),
    image varchar(255),
    key fk_categoria (categoria_id),
    constraint fk_categoria foreign key (categoria_id) references categorias(id)
);

-- Insertar videojuegos
insert into videojuegos (director, titulo, precio, categoria_id, image) values
('Jons Sawyer', 'Fallout New Vegas', 50.00, 1, 'fallout.jpg'),
('Konrad Tomaszkiewicz', 'The Witcher 3', 47.00, 8, 'the witcher 3.jpg'),
('Markus "Notch" Persson', 'Minecraft', 45.00, 8, 'minecraft.png'),
('Laurent Bernier y Robert Darly Purdy', 'Far Cry 3', 45.00, 8, 'far cry 3.jpg'),
('Minh "Gooseman" Le', 'Counter Strike', 45.00, 3, 'counter strike.jpg'),
('Dave Stenton', 'Dead Island 2', 48.00, 2, 'dead island 2.jpg'),
('Masashi Tsuboyama', 'Silent Hill 2', 48.00, 6, 'silent-hill-2.jpg');
-- para añadir imagen tiene que ser director de aqui la imagen tiene que 
-- estar en src

create table usuarios (
    id int auto_increment primary key,
    username varchar(255) unique,
    password varchar(255)
);

-- Insertar usuarios
insert into usuarios (password, username) values
('$2a$10$XK1I17yN0jH1OUkAjs/yen2Mud2PRN...', 'felipe'),  -- contra de este 123456
('$2a$10$pKac.KTc.59jFTFsJzI52txcuzmX8.WCR...', 'usuario'),
('$2a$10$piPTqEdGdolmVkPfmPR.M7rdi0qabg...', 'admin');

show tables;
describe videojuegos;
describe categorias;


select * from videojuegos;  -- id, director, genero y titulo
select * from usuarios; -- id, password y username
select * from categorias;

show create table categorias;

create table categorias (
	id int auto_increment primary key,
    nombre_categoria varchar(100) unique
);

insert into categorias (nombre_categoria) values
('accion'),
('plataformas'),
('shooter'),
('lucha'),
('deportes'),
('terror'),
('survival horror'),
('mundo abierto'),
('estrategia');

