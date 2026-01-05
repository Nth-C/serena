CREATE TABLE personne (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL
);

CREATE TABLE medicament (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stock INT DEFAULT 0
);

INSERT INTO medicament (name, stock) VALUES 
('Tren', 15),
('Doliprane', 30),
('Insuline', 8);