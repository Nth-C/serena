import React, { useState } from 'react';
import './Ocr.css';

const Ocr = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [ocrText, setOcrText] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setOcrText('');
        setError('');
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Veuillez sélectionner un fichier image.');
            return;
        }

        setLoading(true);
        setError('');
        setOcrText('');
        setProgress(0);

        const worker = await Tesseract.createWorker('fra', 1, {
            logger: m => {
                if (m.status === 'recognizing text') {
                    setProgress(Math.round(m.progress * 100));
                }
            },
        });

        try {
            const { data: { text } } = await worker.recognize(selectedFile);
            setOcrText(text);
        } catch (err) {
            setError('Erreur lors de la reconnaissance de l\'image.');
            console.error(err);
        } finally {
            await worker.terminate();
            setLoading(false);
        }
    };

    return (
        <div className="ocr-container">
            <h2>Lecteur d'ordonnance automatique</h2>
            <p>Téléchargez une ordonnance pour en extraire les informations</p>
            
            <div className="ocr-controls">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={!selectedFile || loading}>
                    {loading ? `Analyse en cours... (${progress}%)` : 'Lancer l\'analyse'}
                </button>
            </div>

            {error && <div className="ocr-error">{error}</div>}

            {ocrText && (
                <div className="ocr-result">
                    <h3>Texte extrait :</h3>
                    <textarea value={ocrText} readOnly />
                </div>
            )}
        </div>
    );
};

export default Ocr;