<?php
require_once(__DIR__ . '/../models/trajetDAO.class.php');

class TrajetController {

    /**
     * Gère la mise à jour d'un trajet via une requête POST JSON
     */
    public function update() {
        // 1. Force le format de réponse en JSON
        header('Content-Type: application/json');

        try {
            // 2. Récupération des données JSON envoyées par le Frontend
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);

            // 3. Validation minimale des données requises
            if (empty($data['id_event']) || empty($data['date_deb'])) {
                echo json_encode([
                    'success' => false, 
                    'error' => 'Données manquantes : id_event et date_deb sont obligatoires.'
                ]);
                return;
            }

            // 4. Appel au DAO
            $trajetDAO = new TrajetDAO();
            $success = $trajetDAO->updateTrajet(
                $data['id_event'],
                $data['date_deb'],
                $data['lieu_dep'] ?? '',
                $data['lieu_arr'] ?? '',
                $data['societe'] ?? null,  // Nom de la société si externe
                $data['aidant_id'] ?? null // ID de l'aidant si interne
            );

            // 5. Réponse de succès
            echo json_encode(['success' => $success]);

        } catch (Exception $e) {
            // 6. Gestion des erreurs (ex: erreur SQL ou transaction)
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'error' => $e->getMessage()
            ]);
        }
    }
}