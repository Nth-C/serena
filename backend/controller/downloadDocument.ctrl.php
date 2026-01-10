<?php
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

// 1. Vérifier la connexion
if (!$app->connected || !$app->id_famille) {
    die("Accès non autorisé");
}

$id_doc = $_GET['id'] ?? null;

if ($id_doc) {
    $dao = new DocumentDAO();
    // Tu dois créer cette méthode pour récupérer les infos du doc (nom réel et nom physique)
    $doc = $dao->getDocumentById($id_doc);

    // 2. Vérifier que le document appartient bien à la famille de l'utilisateur
    if ($doc && $doc['id_famille'] == $app->id_famille) {
        $filePath = __DIR__ . '/../uploads/' . $doc['url']; // Nom physique (ex: doc_65a1...)

        if (file_exists($filePath)) {
            // 3. Forcer le téléchargement avec le nom d'origine
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . $doc['nom_doc'] . '"');
            header('Content-Length: ' . filesize($filePath));
            header('Pragma: public');

            // Envoie le contenu du fichier
            readfile($filePath);
            exit;
        }
    }
}

echo "Fichier introuvable ou accès refusé.";