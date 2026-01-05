CREATE TABLE medicament (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stock INT DEFAULT 0
);

INSERT INTO medicament (name, stock) VALUES 
('Tren', 15),
('Doliprane', 30),
('Insuline', 8);