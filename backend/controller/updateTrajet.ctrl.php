<?php
require_once(__DIR__ . '/../models/trajetDAO.class.php');

class TrajetController {

    public function update() {
        header('Content-Type: application/json');

        try {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);

            if (empty($data['id_event']) || empty($data['date_deb'])) {
                echo json_encode([
                    'success' => false, 
                    'error' => 'Données manquantes : id_event et date_deb sont obligatoires.'
                ]);
                return;
            }

            $trajetDAO = new TrajetDAO();

            // met à jour le trajet
            $success = $trajetDAO->updateTrajet(
                $data['id_event'],
                $data['date_deb'],
                $data['lieu_dep'] ?? '',
                $data['lieu_arr'] ?? '',
                $data['societe'] ?? null,  // nom de la société si externe
                $data['aidant_id'] ?? null // id de l'aidant si interne
            );

            echo json_encode(['success' => $success]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'error' => $e->getMessage()
            ]);
        }
    }
}