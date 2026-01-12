DROP TABLE IF EXISTS INVITATION CASCADE;
DROP TABLE IF EXISTS APPARTIENT_A CASCADE;
DROP TABLE IF EXISTS CHARGE CASCADE;
DROP TABLE IF EXISTS EFFECTUE CASCADE;
DROP TABLE IF EXISTS CONSO CASCADE;
DROP TABLE IF EXISTS CONTIENT CASCADE;
DROP TABLE IF EXISTS ACCOMPAGNE CASCADE;
DROP TABLE IF EXISTS TRAJET CASCADE;
DROP TABLE IF EXISTS STOCK_MEDICS CASCADE;
DROP TABLE IF EXISTS FORMS CASCADE;
DROP TABLE IF EXISTS RAPPORTS CASCADE;
DROP TABLE IF EXISTS EVENEMENTS CASCADE;
DROP TABLE IF EXISTS DOCUMENTS CASCADE;
DROP TABLE IF EXISTS CAT CASCADE;
DROP TABLE IF EXISTS ORDONNANCES CASCADE;
DROP TABLE IF EXISTS CAT_MEDICS CASCADE;
DROP TABLE IF EXISTS AIDE CASCADE;
DROP TABLE IF EXISTS SOCIETES CASCADE;
DROP TABLE IF EXISTS PERSONNES CASCADE;
DROP TABLE IF EXISTS FAMS CASCADE;

DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "pgcrypto";
DROP EXTENSION IF EXISTS "pgaudit";
CREATE EXTENSION IF NOT EXISTS "uuid-pgaudit";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 

CREATE TABLE FAMS (
    id_famille UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255),
    nom_aide VARCHAR(255),
    description VARCHAR(255)
);

CREATE TABLE PERSONNES (
    id_personne UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    tps_mdp TIMESTAMPTZ NULL 
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

CREATE TABLE ORDONNANCES (
    id_ordo UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url VARCHAR(255),
    med_ref VARCHAR(255),
    date_deb DATE,
    date_fin DATE,
    nom VARCHAR(255),
    id_famille UUID REFERENCES FAMS(id_famille)
);

CREATE TABLE CAT (
    id_cat UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255),
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
    heure TIME WITH TIME ZONE DEFAULT (CURRENT_TIME + INTERVAL '1 hour'),
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
    quantite INT,
    total INT,
    id_cat_medicament UUID REFERENCES CAT_MEDICS(id_medics),
    id_famille UUID REFERENCES FAMS(id_famille)
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


CREATE TABLE INVITATION (
    id_invitation UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    id_famille_invitee UUID REFERENCES FAMS(id_famille),
    id_pers_invitee UUID REFERENCES PERSONNES(id_personne),
    id_pers_qui_invite UUID REFERENCES PERSONNES(id_personne),
    date_invitation TIMESTAMPTZ DEFAULT NOW() 
);



ALTER TABLE public.accompagne ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aide ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appartient_a ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_medics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contient ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.effectue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordonnances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rapports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_medics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.societes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trajet ENABLE ROW LEVEL SECURITY;
