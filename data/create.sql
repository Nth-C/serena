CREATE TABLE FAMS (
    id_famille SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    nom_aide varchar(255),
    description varchar(255)
);

CREATE TABLE PERSONNES (
    id_personne SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL
);

CREATE TABLE ORDONNANCES (
    id_ordo SERIAL PRIMARY KEY,
    url VARCHAR(255),
    med_ref VARCHAR(255),
    date_deb DATE,
    date_fin DATE,
    nom VARCHAR(255),
    id_famille INT REFERENCES FAMS(id_famille)
);

CREATE TABLE CAT(
    id_cat SERIAL PRIMARY KEY,
    nom varchar(255),
    id_famille INT REFERENCES FAMS(id_famille)
);

CREATE TABLE DOCUMENTS (
    id_doc SERIAL PRIMARY KEY,
    url VARCHAR(255),
    cat VARCHAR(100),
    nom_doc VARCHAR(255),
    type VARCHAR(50),
    id_famille INT REFERENCES FAMS(id_famille),
    id_cat INT REFERENCES CAT(id_cat)

);

CREATE TABLE EVENEMENTS (
    id_event SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    date_deb DATE,
    date_fin DATE,
    lieu VARCHAR(255),
    note TEXT,
    id_famille INT REFERENCES FAMS(id_famille)
);

-- Table de liaison Many-to-Many
CREATE TABLE ACCOMPAGNE (
    id_personne INT REFERENCES PERSONNES(id_personne),
    id_event INT REFERENCES EVENEMENTS(id_event),
    PRIMARY KEY (id_personne, id_event)
);

CREATE TABLE RAPPORTS (
    id_rapport SERIAL PRIMARY KEY,
    description TEXT,
    date DATE,
    id_famille INT REFERENCES FAMS(id_famille),
    id_personne INT REFERENCES PERSONNES(id_personne)
);

CREATE TABLE FORMS (
    nom_aide VARCHAR(255) PRIMARY KEY,
    description TEXT,
    access VARCHAR(255),
    cmt_obt TEXT,
    doc_req TEXT,
    aide_fournit VARCHAR(255),
    resultat VARCHAR(255),
    age_aidant INT,
    age_aide INT, -- Correction: accent retiré (age_aidé -> age_aide)
    id_famille INT REFERENCES FAMS(id_famille)
);

CREATE TABLE STOCK_MEDICS (
    id_medicament SERIAL PRIMARY KEY,
    date_achat DATE,
    designation_med VARCHAR(255),
    quantite int,
    id_famille INT REFERENCES FAMS(id_famille)
);

CREATE TABLE CONTIENT (
    id_medicament INT REFERENCES STOCK_MEDICS(id_medicament),
    id_ordo INT REFERENCES ORDONNANCES(id_ordo),
    PRIMARY KEY (id_medicament, id_ordo)
);

CREATE TABLE CONSO (
    id_medicament INT REFERENCES STOCK_MEDICS(id_medicament),
    id_rapport INT REFERENCES RAPPORTS(id_rapport),
    PRIMARY KEY (id_medicament) 
);

CREATE TABLE CAT_MEDICS (
    nom_medicament VARCHAR(255) PRIMARY KEY,
    id_medicament INT REFERENCES STOCK_MEDICS(id_medicament)
);

CREATE TABLE TRAJET (
    id_trajet SERIAL PRIMARY KEY,
    demande_trajet BOOLEAN,
    date_deb DATE,
    date_fin DATE,
    lieu_dep VARCHAR(255),
    lieu_arr VARCHAR(255),
    id_event INT REFERENCES EVENEMENTS(id_event)
);

CREATE TABLE EFFECTUE (
    id_trajet INT REFERENCES TRAJET(id_trajet),
    id_personne INT REFERENCES PERSONNES(id_personne),
    PRIMARY KEY (id_trajet)
);

CREATE TABLE SOCIETES (
    id_societe SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    adresse VARCHAR(255)
);

CREATE TABLE CHARGE (
    id_trajet INT REFERENCES TRAJET(id_trajet),
    id_societe INT REFERENCES SOCIETES(id_societe),
    PRIMARY KEY (id_trajet)
);

CREATE TABLE AIDE (
    id_aide SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    description TEXT
);


CREATE TABLE APPARTIENT_A (
    id_famille INT REFERENCES FAMS(id_famille) ON DELETE CASCADE,
    id_personne INT REFERENCES PERSONNES(id_personne) ON DELETE CASCADE,
    role VARCHAR(50), -- Optionnel : pour savoir si c'est un 'parent', 'enfant', 'aidant', etc.
    PRIMARY KEY (id_famille, id_personne)
);