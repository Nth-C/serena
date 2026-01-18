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
    DROP TABLE IF EXISTS AUDIT_LOGS CASCADE;



    DROP EXTENSION IF EXISTS "uuid-ossp";
    DROP EXTENSION IF EXISTS "pgcrypto";
    DROP EXTENSION IF EXISTS "pgaudit";
    DROP EXTENSION IF EXISTS "auth_delay";
    CREATE EXTENSION IF NOT EXISTS "auth_delay";
    CREATE EXTENSION IF NOT EXISTS "pgaudit";
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 2 (class 3079 OID 273741458)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


CREATE FUNCTION public.audit_trigger_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    app_user text;
BEGIN
    -- 1. On essaie de lire la variable envoyée par le DAL PHP
    app_user := current_setting('app.current_user', true);
    
    -- 2. Si la variable est vide (ex: modif manuelle dans la BDD), on utilise le user technique
    IF app_user IS NULL OR app_user = '' THEN
        NEW.user_name := session_user; 
    ELSE
        NEW.user_name := app_user; -- On utilise le nom envoyé par PHP (ex: woodb)
    END IF;

    -- 3. Gestion de l'ID Famille (inchangé)
    IF (TG_OP = 'DELETE') THEN
        NEW.id_famille_audit := (OLD.old_values->>'id_famille')::uuid;
    ELSE
        NEW.id_famille_audit := (NEW.new_values->>'id_famille')::uuid;
    END IF;

    RETURN NEW;
END;
$$;



CREATE FUNCTION public.trigger_audit_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_famille_id uuid := NULL; -- Variable pour stocker l'ID famille trouvé
    v_new_json jsonb;
    v_old_json jsonb;
BEGIN
    -- 1. Préparer les JSON
    IF (TG_OP = 'INSERT') THEN
        v_new_json := row_to_json(NEW);
        -- Tenter d'extraire id_famille du JSON si la colonne existe dans la table cible
        IF (v_new_json ? 'id_famille') THEN
            v_famille_id := (v_new_json ->> 'id_famille')::uuid;
        END IF;
        
        INSERT INTO AUDIT_LOGS (schema_name, table_name, operation, new_values, id_famille_audit)
        VALUES (TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP, v_new_json, v_famille_id);
        RETURN NEW;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        v_new_json := row_to_json(NEW);
        v_old_json := row_to_json(OLD);
        
        -- On cherche id_famille dans les nouvelles valeurs
        IF (v_new_json ? 'id_famille') THEN
            v_famille_id := (v_new_json ->> 'id_famille')::uuid;
        END IF;

        INSERT INTO AUDIT_LOGS (schema_name, table_name, operation, old_values, new_values, id_famille_audit)
        VALUES (TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP, v_old_json, v_new_json, v_famille_id);
        RETURN NEW;
        
    ELSIF (TG_OP = 'DELETE') THEN
        v_old_json := row_to_json(OLD);
        
        -- Pour un delete, on cherche id_famille dans les anciennes valeurs
        IF (v_old_json ? 'id_famille') THEN
            v_famille_id := (v_old_json ->> 'id_famille')::uuid;
        END IF;

        INSERT INTO AUDIT_LOGS (schema_name, table_name, operation, old_values, id_famille_audit)
        VALUES (TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP, v_old_json, v_famille_id);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 273741654)
-- Name: accompagne; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accompagne (
    id_personne uuid NOT NULL,
    id_event uuid NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 273741523)
-- Name: aide; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.aide (
    id_aide uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255) NOT NULL,
    description text,
    status boolean DEFAULT false NOT NULL,
    statuspro character varying,
    depense character varying,
    fiscalite character varying,
    role character varying NOT NULL,
    age_aide character varying,
    gir character varying NOT NULL,
    situation_medicale character varying NOT NULL,
    aide_apa boolean,
    aide_pch boolean,
    aide_aucune boolean,
    objectif character varying,
    id_famille uuid
);


--
-- TOC entry 240 (class 1259 OID 273985444)
-- Name: aide_finance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.aide_finance (
    id_aide_fin character varying NOT NULL,
    description text,
    acces text,
    obtention text,
    documents_req text,
    montant text
);


--
-- TOC entry 235 (class 1259 OID 273741729)
-- Name: appartient_a; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appartient_a (
    id_famille uuid NOT NULL,
    id_personne uuid NOT NULL,
    role character varying(50)
);


--
-- TOC entry 237 (class 1259 OID 273861304)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    schema_name text,
    table_name text,
    operation text,
    user_name text DEFAULT CURRENT_USER,
    action_tstamp timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    old_values jsonb,
    new_values jsonb,
    query_text text,
    id_audit uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_famille_audit uuid,
    id_user character varying
);


--
-- TOC entry 223 (class 1259 OID 273741552)
-- Name: cat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat (
    id_cat uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255),
    id_famille uuid,
    role character varying(25) DEFAULT 'Professionelle'::character varying
);


--
-- TOC entry 221 (class 1259 OID 273741531)
-- Name: cat_medics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_medics (
    id_medics uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code_cis character varying(20),
    designation_elem_pharma text,
    code_substance character varying(20),
    denomination_substance text,
    dosage_substance character varying(255),
    reference_dosage character varying(255),
    nature_composant character varying(100),
    numero_lien integer
);


--
-- TOC entry 234 (class 1259 OID 273741714)
-- Name: charge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.charge (
    id_trajet uuid NOT NULL,
    id_societe uuid
);


--
-- TOC entry 232 (class 1259 OID 273741684)
-- Name: conso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conso (
    id_medicament uuid NOT NULL,
    id_rapport uuid NOT NULL,
    nombre_medic_conso integer
);


--
-- TOC entry 231 (class 1259 OID 273741669)
-- Name: contient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contient (
    id_medicament uuid NOT NULL,
    id_ordo uuid NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 273741563)
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id_doc uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying(255),
    cat character varying(100),
    nom_doc character varying(255),
    type character varying(50),
    id_famille uuid,
    id_cat uuid
);


--
-- TOC entry 233 (class 1259 OID 273741699)
-- Name: effectue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.effectue (
    id_trajet uuid NOT NULL,
    id_personne uuid
);


--
-- TOC entry 225 (class 1259 OID 273741581)
-- Name: evenements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evenements (
    id_event uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255),
    date_deb timestamp without time zone,
    date_fin timestamp without time zone,
    lieu character varying(255),
    note text,
    id_famille uuid
);


--
-- TOC entry 241 (class 1259 OID 274050502)
-- Name: famille_trajet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.famille_trajet (
    id_famille uuid NOT NULL,
    id_trajet uuid NOT NULL,
    date_liaison timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 217 (class 1259 OID 273741495)
-- Name: fams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fams (
    id_famille uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255),
    nom_aide character varying(255),
    description character varying(255)
);


--
-- TOC entry 227 (class 1259 OID 273741613)
-- Name: forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms (
    nom_aide character varying(255) NOT NULL,
    description text,
    access character varying(255),
    cmt_obt text,
    doc_req text,
    aide_fournit character varying(255),
    resultat character varying(255),
    age_aidant integer,
    age_aide integer,
    id_famille uuid
);


--
-- TOC entry 236 (class 1259 OID 273855095)
-- Name: invitation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitation (
    id_famille_invitee uuid NOT NULL,
    id_pers_invitee uuid NOT NULL,
    id_pers_qui_invite uuid NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 273964333)
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.login_attempts (
    ip_address character varying(128) NOT NULL,
    attempt_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 273741539)
-- Name: ordonnances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ordonnances (
    id_ordo uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying(255),
    med_ref character varying(255),
    date_deb date,
    date_fin date,
    nom character varying(255),
    id_famille uuid
);


--
-- TOC entry 218 (class 1259 OID 273741503)
-- Name: personnes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personnes (
    id_personne uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    mail character varying(255) NOT NULL,
    username character varying(100) NOT NULL,
    mdp character varying(255) NOT NULL,
    date_naissance date NOT NULL,
    tps_mdp timestamp with time zone[],
    rgpd boolean DEFAULT false,
    reset_token character varying(255),
    reset_expires timestamp with time zone,
    est_actif boolean DEFAULT false,
    token_activation character varying(255),
    is_fait boolean DEFAULT false
);


--
-- TOC entry 4303 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN personnes.reset_token; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.personnes.reset_token IS 'epstein boss';


--
-- TOC entry 4304 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN personnes.reset_expires; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.personnes.reset_expires IS 'epstein thomas final rizzler boss';


--
-- TOC entry 4305 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN personnes.token_activation; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.personnes.token_activation IS 'mathieu 67';


--
-- TOC entry 226 (class 1259 OID 273741594)
-- Name: rapports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rapports (
    id_rapport uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text,
    date date,
    heure time with time zone DEFAULT (CURRENT_TIME + '01:00:00'::interval),
    id_famille uuid,
    id_personne uuid,
    nom character varying(255) NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 273943694)
-- Name: signalements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signalements (
    id_signal uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mail_signal character varying(255),
    sujet character varying(255),
    message character varying(255) NOT NULL,
    id_pers_signal uuid,
    status character varying DEFAULT 'OUVERT'::character varying NOT NULL,
    date timestamp with time zone
);


--
-- TOC entry 219 (class 1259 OID 273741515)
-- Name: societes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.societes (
    id_societe uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255),
    adresse character varying(255)
);


--
-- TOC entry 228 (class 1259 OID 273741625)
-- Name: stock_medics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_medics (
    id_medicament uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date_achat date,
    designation_med character varying(255),
    quantite integer,
    total integer,
    id_cat_medicament uuid,
    id_famille uuid
);


--
-- TOC entry 229 (class 1259 OID 273741641)
-- Name: trajet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trajet (
    id_trajet uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date_deb date,
    date_fin date,
    lieu_dep character varying(255),
    lieu_arr character varying(255),
    id_event uuid
);



ALTER TABLE ONLY public.accompagne
    ADD CONSTRAINT accompagne_pkey_old PRIMARY KEY (id_personne, id_event);


--
-- TOC entry 4040 (class 2606 OID 273741530)
-- Name: aide aide_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aide
    ADD CONSTRAINT aide_pkey PRIMARY KEY (id_aide);


--
-- TOC entry 4072 (class 2606 OID 273741733)
-- Name: appartient_a appartient_a_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appartient_a
    ADD CONSTRAINT appartient_a_pkey PRIMARY KEY (id_famille, id_personne);


--
-- TOC entry 4076 (class 2606 OID 273861937)
-- Name: audit_logs audit_logs_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pk PRIMARY KEY (id_audit);


--
-- TOC entry 4044 (class 2606 OID 273741538)
-- Name: cat_medics cat_medics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_medics
    ADD CONSTRAINT cat_medics_pkey PRIMARY KEY (id_medics);


--
-- TOC entry 4048 (class 2606 OID 273741557)
-- Name: cat cat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat
    ADD CONSTRAINT cat_pkey PRIMARY KEY (id_cat);


--
-- TOC entry 4070 (class 2606 OID 273741718)
-- Name: charge charge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charge
    ADD CONSTRAINT charge_pkey PRIMARY KEY (id_trajet);


--
-- TOC entry 4066 (class 2606 OID 273915604)
-- Name: conso conso_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conso
    ADD CONSTRAINT conso_pk PRIMARY KEY (id_rapport, id_medicament);


--
-- TOC entry 4064 (class 2606 OID 273741673)
-- Name: contient contient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contient
    ADD CONSTRAINT contient_pkey PRIMARY KEY (id_medicament, id_ordo);


--
-- TOC entry 4050 (class 2606 OID 273741570)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id_doc);


--
-- TOC entry 4068 (class 2606 OID 273741703)
-- Name: effectue effectue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.effectue
    ADD CONSTRAINT effectue_pkey PRIMARY KEY (id_trajet);


--
-- TOC entry 4052 (class 2606 OID 273741588)
-- Name: evenements evenements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evenements
    ADD CONSTRAINT evenements_pkey PRIMARY KEY (id_event);


--
-- TOC entry 4084 (class 2606 OID 274050507)
-- Name: famille_trajet famille_trajet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.famille_trajet
    ADD CONSTRAINT famille_trajet_pkey PRIMARY KEY (id_famille, id_trajet);


--
-- TOC entry 4030 (class 2606 OID 273741502)
-- Name: fams fams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fams
    ADD CONSTRAINT fams_pkey PRIMARY KEY (id_famille);


--
-- TOC entry 4056 (class 2606 OID 273741619)
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (nom_aide);


--
-- TOC entry 4074 (class 2606 OID 273945213)
-- Name: invitation invitation_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT invitation_pk PRIMARY KEY (id_famille_invitee, id_pers_invitee, id_pers_qui_invite);


--
-- TOC entry 4082 (class 2606 OID 273984921)
-- Name: login_attempts login_attempts_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pk PRIMARY KEY (id);


--
-- TOC entry 4046 (class 2606 OID 273741546)
-- Name: ordonnances ordonnances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordonnances
    ADD CONSTRAINT ordonnances_pkey PRIMARY KEY (id_ordo);


--
-- TOC entry 4032 (class 2606 OID 273741512)
-- Name: personnes personnes_mail_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnes
    ADD CONSTRAINT personnes_mail_key UNIQUE (mail);


--
-- TOC entry 4034 (class 2606 OID 273741510)
-- Name: personnes personnes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnes
    ADD CONSTRAINT personnes_pkey PRIMARY KEY (id_personne);


--
-- TOC entry 4036 (class 2606 OID 273741514)
-- Name: personnes personnes_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnes
    ADD CONSTRAINT personnes_username_key UNIQUE (username);


--
-- TOC entry 4054 (class 2606 OID 273741602)
-- Name: rapports rapports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rapports
    ADD CONSTRAINT rapports_pkey PRIMARY KEY (id_rapport);


--
-- TOC entry 4079 (class 2606 OID 273943701)
-- Name: signalements signalements_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signalements
    ADD CONSTRAINT signalements_pk PRIMARY KEY (id_signal);


--
-- TOC entry 4038 (class 2606 OID 273741522)
-- Name: societes societes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.societes
    ADD CONSTRAINT societes_pkey PRIMARY KEY (id_societe);


--
-- TOC entry 4058 (class 2606 OID 273741630)
-- Name: stock_medics stock_medics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_medics
    ADD CONSTRAINT stock_medics_pkey PRIMARY KEY (id_medicament);


--
-- TOC entry 4060 (class 2606 OID 273741648)
-- Name: trajet trajet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trajet
    ADD CONSTRAINT trajet_pkey PRIMARY KEY (id_trajet);


--
-- TOC entry 4042 (class 2606 OID 274051936)
-- Name: aide unique_id_famille; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aide
    ADD CONSTRAINT unique_id_famille UNIQUE (id_famille);


--
-- TOC entry 4080 (class 1259 OID 273966660)
-- Name: idx_attempts_ip_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_ip_time ON public.login_attempts USING btree (ip_address, attempt_time);


--
-- TOC entry 4077 (class 1259 OID 273861314)
-- Name: idx_audit_table; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_table ON public.audit_logs USING btree (table_name);


--
-- TOC entry 4121 (class 2620 OID 273861295)
-- Name: documents audit_trigger_documents; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_trigger_documents AFTER INSERT OR DELETE OR UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_function();


--
-- TOC entry 4122 (class 2620 OID 273861055)
-- Name: stock_medics audit_trigger_stocks; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_trigger_stocks AFTER INSERT OR DELETE OR UPDATE ON public.stock_medics FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_function();


--
-- TOC entry 4097 (class 2606 OID 273996968)
-- Name: accompagne accompagne_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accompagne
    ADD CONSTRAINT accompagne_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.evenements(id_event) ON DELETE CASCADE;


--
-- TOC entry 4098 (class 2606 OID 273996893)
-- Name: accompagne accompagne_id_personne_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accompagne
    ADD CONSTRAINT accompagne_id_personne_fkey FOREIGN KEY (id_personne) REFERENCES public.personnes(id_personne) ON DELETE CASCADE;


--
-- TOC entry 4107 (class 2606 OID 273996908)
-- Name: appartient_a appartient_a_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appartient_a
    ADD CONSTRAINT appartient_a_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4108 (class 2606 OID 273996878)
-- Name: appartient_a appartient_a_id_personne_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appartient_a
    ADD CONSTRAINT appartient_a_id_personne_fkey FOREIGN KEY (id_personne) REFERENCES public.personnes(id_personne) ON DELETE CASCADE;


--
-- TOC entry 4115 (class 2606 OID 273861974)
-- Name: audit_logs audit_logs_fams_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_fams_fk FOREIGN KEY (id_famille_audit) REFERENCES public.fams(id_famille) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4087 (class 2606 OID 273996938)
-- Name: cat cat_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat
    ADD CONSTRAINT cat_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4105 (class 2606 OID 273741724)
-- Name: charge charge_id_societe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charge
    ADD CONSTRAINT charge_id_societe_fkey FOREIGN KEY (id_societe) REFERENCES public.societes(id_societe);


--
-- TOC entry 4106 (class 2606 OID 273996958)
-- Name: charge charge_id_trajet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charge
    ADD CONSTRAINT charge_id_trajet_fkey FOREIGN KEY (id_trajet) REFERENCES public.trajet(id_trajet) ON DELETE CASCADE;


--
-- TOC entry 4101 (class 2606 OID 273741689)
-- Name: conso conso_id_medicament_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conso
    ADD CONSTRAINT conso_id_medicament_fkey FOREIGN KEY (id_medicament) REFERENCES public.stock_medics(id_medicament);


--
-- TOC entry 4102 (class 2606 OID 273996978)
-- Name: conso conso_id_rapport_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conso
    ADD CONSTRAINT conso_id_rapport_fkey FOREIGN KEY (id_rapport) REFERENCES public.rapports(id_rapport) ON DELETE CASCADE;


--
-- TOC entry 4099 (class 2606 OID 273741674)
-- Name: contient contient_id_medicament_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contient
    ADD CONSTRAINT contient_id_medicament_fkey FOREIGN KEY (id_medicament) REFERENCES public.stock_medics(id_medicament);


--
-- TOC entry 4100 (class 2606 OID 273996973)
-- Name: contient contient_id_ordo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contient
    ADD CONSTRAINT contient_id_ordo_fkey FOREIGN KEY (id_ordo) REFERENCES public.ordonnances(id_ordo) ON DELETE CASCADE;


--
-- TOC entry 4088 (class 2606 OID 273741576)
-- Name: documents documents_id_cat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_id_cat_fkey FOREIGN KEY (id_cat) REFERENCES public.cat(id_cat);


--
-- TOC entry 4089 (class 2606 OID 273996933)
-- Name: documents documents_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4103 (class 2606 OID 273996888)
-- Name: effectue effectue_id_personne_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.effectue
    ADD CONSTRAINT effectue_id_personne_fkey FOREIGN KEY (id_personne) REFERENCES public.personnes(id_personne) ON DELETE CASCADE;


--
-- TOC entry 4104 (class 2606 OID 273996953)
-- Name: effectue effectue_id_trajet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.effectue
    ADD CONSTRAINT effectue_id_trajet_fkey FOREIGN KEY (id_trajet) REFERENCES public.trajet(id_trajet) ON DELETE CASCADE;


--
-- TOC entry 4090 (class 2606 OID 273996923)
-- Name: evenements evenements_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evenements
    ADD CONSTRAINT evenements_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4085 (class 2606 OID 274051767)
-- Name: aide fk_aide_famille; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aide
    ADD CONSTRAINT fk_aide_famille FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4119 (class 2606 OID 274050508)
-- Name: famille_trajet fk_famille; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.famille_trajet
    ADD CONSTRAINT fk_famille FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4120 (class 2606 OID 274050513)
-- Name: famille_trajet fk_trajet; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.famille_trajet
    ADD CONSTRAINT fk_trajet FOREIGN KEY (id_trajet) REFERENCES public.trajet(id_trajet) ON DELETE CASCADE;


--
-- TOC entry 4093 (class 2606 OID 273996943)
-- Name: forms forms_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4109 (class 2606 OID 273855184)
-- Name: invitation invitation_fams_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT invitation_fams_fk FOREIGN KEY (id_famille_invitee) REFERENCES public.fams(id_famille);


--
-- TOC entry 4110 (class 2606 OID 273996948)
-- Name: invitation invitation_id_famille_invitee_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT invitation_id_famille_invitee_fkey FOREIGN KEY (id_famille_invitee) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4111 (class 2606 OID 273996898)
-- Name: invitation invitation_id_pers_invitee_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT invitation_id_pers_invitee_fkey FOREIGN KEY (id_pers_invitee) REFERENCES public.personnes(id_personne) ON DELETE CASCADE;


--
-- TOC entry 4112 (class 2606 OID 273996903)
-- Name: invitation invitation_id_pers_qui_invite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT invitation_id_pers_qui_invite_fkey FOREIGN KEY (id_pers_qui_invite) REFERENCES public.personnes(id_personne) ON DELETE CASCADE;


--
-- TOC entry 4113 (class 2606 OID 273855403)
-- Name: invitation invitation_personnes; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT invitation_personnes FOREIGN KEY (id_pers_invitee) REFERENCES public.personnes(id_personne);


--
-- TOC entry 4114 (class 2606 OID 273855204)
-- Name: invitation invitation_personnes_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT invitation_personnes_fk FOREIGN KEY (id_pers_qui_invite) REFERENCES public.personnes(id_personne);


--
-- TOC entry 4086 (class 2606 OID 273996918)
-- Name: ordonnances ordonnances_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordonnances
    ADD CONSTRAINT ordonnances_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4091 (class 2606 OID 273996928)
-- Name: rapports rapports_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rapports
    ADD CONSTRAINT rapports_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4092 (class 2606 OID 273996883)
-- Name: rapports rapports_id_personne_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rapports
    ADD CONSTRAINT rapports_id_personne_fkey FOREIGN KEY (id_personne) REFERENCES public.personnes(id_personne) ON DELETE CASCADE;


--
-- TOC entry 4116 (class 2606 OID 273996873)
-- Name: signalements signalements_id_pers_signal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signalements
    ADD CONSTRAINT signalements_id_pers_signal_fkey FOREIGN KEY (id_pers_signal) REFERENCES public.personnes(id_personne) ON DELETE CASCADE;


--
-- TOC entry 4117 (class 2606 OID 273943953)
-- Name: signalements signalements_personnes_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signalements
    ADD CONSTRAINT signalements_personnes_fk FOREIGN KEY (id_pers_signal) REFERENCES public.personnes(id_personne);


--
-- TOC entry 4118 (class 2606 OID 273943702)
-- Name: signalements signalements_personnes_fk_mail; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signalements
    ADD CONSTRAINT signalements_personnes_fk_mail FOREIGN KEY (mail_signal) REFERENCES public.personnes(mail);


--
-- TOC entry 4094 (class 2606 OID 273996983)
-- Name: stock_medics stock_medics_id_cat_medicament_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_medics
    ADD CONSTRAINT stock_medics_id_cat_medicament_fkey FOREIGN KEY (id_cat_medicament) REFERENCES public.cat_medics(id_medics) ON DELETE CASCADE;


--
-- TOC entry 4095 (class 2606 OID 273996913)
-- Name: stock_medics stock_medics_id_famille_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_medics
    ADD CONSTRAINT stock_medics_id_famille_fkey FOREIGN KEY (id_famille) REFERENCES public.fams(id_famille) ON DELETE CASCADE;


--
-- TOC entry 4096 (class 2606 OID 273996963)
-- Name: trajet trajet_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trajet
    ADD CONSTRAINT trajet_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.evenements(id_event) ON DELETE CASCADE;


--
-- TOC entry 4268 (class 0 OID 273741654)
-- Dependencies: 230
-- Name: accompagne; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.accompagne ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4266 (class 0 OID 273741523)
-- Dependencies: 220
-- Name: aide; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.aide ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4269 (class 0 OID 273741729)
-- Dependencies: 235
-- Name: appartient_a; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.appartient_a ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4267 (class 0 OID 273741552)
-- Dependencies: 223
-- Name: cat; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cat ENABLE ROW LEVEL SECURITY;

-- Completed on 2026-01-18 11:49:28

--
-- PostgreSQL database dump complete
--

