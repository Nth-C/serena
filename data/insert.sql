psql -h postgresql-sere-na.alwaysdata.net -U sere-na -d sere-na_db -c "\copy cat_medics(code_cis, designation_elem_pharma, code_substance, denomination_substance, dosage_substance, reference_dosage, nature_composant, numero_lien) FROM 'CIS_COMPO_bdpm.txt' WITH (FORMAT CSV, DELIMITER E'\t
', QUOTE E'\b', ENCODING 'LATIN1');"



SkibidiRizzler67

psql -h postgresql-sere-na.alwaysdata.net -U sere-na -d sere-na_test -c "\copy cat_medics(code_cis, designation_elem_pharma, code_substance, denomination_substance, dosage_substance, reference_dosage, nature_composant, numero_lien) FROM 'CIS_COMPO_bdpm.txt' WITH (FORMAT CSV, DELIMITER E'\t', QUOTE E'\b', ENCODING 'LATIN1');"