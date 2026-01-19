<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Pour le développement, à affiner pour la production
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Autoloader de Composer
require_once __DIR__ . '/../vendor/autoload.php';

use Google\Cloud\Vision\V1\ImageAnnotatorClient;

// Vérifier la méthode de la requête et la présence du fichier
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Requête invalide. Utilisez POST avec un champ "image".']);
    exit;
}

// Ajout de la vérification des erreurs de téléversement
if ($_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    $uploadErrors = [
        UPLOAD_ERR_INI_SIZE   => "Le fichier dépasse la taille maximale autorisée par le serveur (upload_max_filesize).",
        UPLOAD_ERR_FORM_SIZE  => "Le fichier dépasse la taille maximale autorisée par le formulaire.",
        UPLOAD_ERR_PARTIAL    => "Le fichier n'a été que partiellement téléversé.",
        UPLOAD_ERR_NO_FILE    => "Aucun fichier n'a été téléversé.",
        UPLOAD_ERR_NO_TMP_DIR => "Le dossier temporaire est manquant.",
        UPLOAD_ERR_CANT_WRITE => "Échec de l'écriture du fichier sur le disque.",
        UPLOAD_ERR_EXTENSION  => "Une extension PHP a arrêté le téléversement du fichier.",
    ];
    $errorCode = $_FILES['image']['error'];
    $errorMessage = $uploadErrors[$errorCode] ?? "Une erreur inconnue est survenue lors du téléversement.";
    echo json_encode(['error' => $errorMessage]);
    exit;
}

$credentialsPath = __DIR__ . '/../google-vision-credentials.json';
if (!file_exists($credentialsPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Fichier de configuration du service Google Vision introuvable.']);
    exit;
}

try {
    // Récupérer le contenu de l'image
    $imageContent = file_get_contents($_FILES['image']['tmp_name']);

    // Créer le client authentifié
    $imageAnnotator = new ImageAnnotatorClient([
        'credentials' => $credentialsPath
    ]);

    // Appeler l'API de détection de texte
    $response = $imageAnnotator->textDetection($imageContent);
    $texts = $response->getTextAnnotations();

    // Formater la réponse
    if (count($texts) > 0) {
        // Le premier élément est souvent le texte complet
        $fullText = $texts[0]->getDescription();
        echo json_encode(['text' => $fullText]);
    } else {
        echo json_encode(['text' => 'Aucun texte n\'a été détecté dans l\'image.']);
    }

    // Fermer le client
    $imageAnnotator->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'appel à l\'API Google Vision: ' . $e->getMessage()]);
}

