CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE FAMS (
    id_famille UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255),
    nom_aide varchar(255),
    description varchar(255)
);

CREATE TABLE PERSONNES (
    id_personne UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL
);

CREATE TABLE SOCIETES (
    id_societe UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255),
    adresse VARCHAR(255)
);

CREATE TABLE AIDE (
    id_aide UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255),
    description TEXT
);


CREATE TABLE ORDONNANCES (
    id_ordo UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url VARCHAR(255),
    med_ref VARCHAR(255),
    date_deb DATE,
    date_fin DATE,
    nom VARCHAR(255),
    id_famille UUID REFERENCES FAMS(id_famille)
);

CREATE TABLE CAT(
    id_cat UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom varchar(255),
    id_famille UUID REFERENCES FAMS(id_famille)
);

CREATE TABLE DOCUMENTS (
    id_doc UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url VARCHAR(255),
    cat VARCHAR(100),
    nom_doc VARCHAR(255),
    type VARCHAR(50),
    id_famille UUID REFERENCES FAMS(id_famille),
    id_cat UUID REFERENCES CAT(id_cat)
);

CREATE TABLE EVENEMENTS (
    id_event UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255),
    date_deb DATE,
    date_fin DATE,
    lieu VARCHAR(255),
    note TEXT,
    id_famille UUID REFERENCES FAMS(id_famille)
);

CREATE TABLE RAPPORTS (
    id_rapport UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT,
    date DATE,
    heure TIME WITH TIME ZONE DEFAULT CURRENT_TIME,
    id_famille UUID REFERENCES FAMS(id_famille),
    id_personne UUID REFERENCES PERSONNES(id_personne)
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
    age_aide INT, 
    id_famille UUID REFERENCES FAMS(id_famille)
);

CREATE TABLE STOCK_MEDICS (
    id_medicament UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_achat DATE,
    designation_med VARCHAR(255),
    quantite int,
    id_cat_medicament UUID REFERENCES CAT(id_medicament)
    id_famille UUID REFERENCES FAMS(id_famille)
);

CREATE TABLE CAT_MEDICS (
    id_medics UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_cis VARCHAR(20),
    designation_elem_pharma TEXT,
    code_substance VARCHAR(20),
    denomination_substance TEXT,
    dosage_substance VARCHAR(255),
    reference_dosage VARCHAR(255),
    nature_composant VARCHAR(100),
    numero_lien INT
);

CREATE TABLE TRAJET (
    id_trajet UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demande_trajet BOOLEAN,
    date_deb DATE,
    date_fin DATE,
    lieu_dep VARCHAR(255),
    lieu_arr VARCHAR(255),
    id_event UUID REFERENCES EVENEMENTS(id_event)
);


CREATE TABLE ACCOMPAGNE (
    id_personne UUID REFERENCES PERSONNES(id_personne),
    id_event UUID REFERENCES EVENEMENTS(id_event),
    PRIMARY KEY (id_personne, id_event)
);

CREATE TABLE CONTIENT (
    id_medicament UUID REFERENCES STOCK_MEDICS(id_medicament),
    id_ordo UUID REFERENCES ORDONNANCES(id_ordo),
    PRIMARY KEY (id_medicament, id_ordo)
);

CREATE TABLE CONSO (
    id_medicament UUID REFERENCES STOCK_MEDICS(id_medicament),
    id_rapport UUID REFERENCES RAPPORTS(id_rapport),
    PRIMARY KEY (id_medicament) 
);

CREATE TABLE EFFECTUE (
    id_trajet UUID REFERENCES TRAJET(id_trajet),
    id_personne UUID REFERENCES PERSONNES(id_personne),
    PRIMARY KEY (id_trajet)
);

CREATE TABLE CHARGE (
    id_trajet UUID REFERENCES TRAJET(id_trajet),
    id_societe UUID REFERENCES SOCIETES(id_societe),
    PRIMARY KEY (id_trajet)
);

CREATE TABLE APPARTIENT_A (
    id_famille UUID REFERENCES FAMS(id_famille) ON DELETE CASCADE,
    id_personne UUID REFERENCES PERSONNES(id_personne) ON DELETE CASCADE,
    role VARCHAR(50), 
    PRIMARY KEY (id_famille, id_personne)
);


UPDATE "public"."rapports" 
SET "heure" = "heure" + INTERVAL '1 hour';

\copy CAT_MEDICS(code_cis, designation_elem_pharma, code_substance, denomination_substance, dosage_substance, reference_dosage, nature_composant, numero_lien) FROM 'CIS_COMPO_bdpm.txt' WITH (FORMAT CSV, DELIMITER E'\t', QUOTE E'\b', ENCODING 'LATIN1');

