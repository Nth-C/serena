import React, { useState } from 'react';
import Slide from '../components/slide/Slide';
import { useLocation } from 'react-router-dom';
import './signalement.css';

const Signalement = ({ isOpen = true, onClose = () => {} }) => {
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const location = useLocation();
  const isPageRoute = location.pathname === '/signalement' || location.pathname === '/signalement/';

  const handleReset = () => {
    setSubject('');
    setMessageBody('');
    setStatus({ type: '', msg: '' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !messageBody.trim()) {
      setStatus({ type: 'error', msg: 'Veuillez remplir tous les champs.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const url = `${apiUrl}/?route=mail/send&subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(messageBody)}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', msg: 'Message envoyé avec succès !' });
        handleReset();
        setTimeout(() => {
          setStatus({ type: '', msg: '' });
        }, 3000);
      } else {
        setStatus({ type: 'error', msg: data.error || 'Erreur lors de l\'envoi.' });
      }

    } catch (err) {
      console.error("Erreur mail:", err);
      setStatus({ type: 'error', msg: "Erreur technique serveur." });
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <div className="signalement-form-container">
      <div className="signalement-header">
        <h2>Nouveau message</h2>
      </div>

      {status.msg && (
        <div className={`signalement-status ${status.type}`}>
          {status.msg}
        </div>
      )}

      <form className="signalement-form" onSubmit={handleSend}>
        <div className="form-group">
          <label htmlFor="to">À :</label>
          <input
            type="text"
            id="to"
            value="Administration"
            readOnly
            className="form-input readonly"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Sujet :</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Objet de votre message..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message :</label>
          <textarea
            id="message"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            required
            rows={8}
            placeholder="Écrivez votre message ici..."
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Effacer
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );

  if (isPageRoute) {
    return (
      <div className="signalement-page">
        {form}
      </div>
    );
  }

  return (
    <Slide title={"Nouveau message"} isOpen={isOpen} toggleOpen={onClose}>
      {form}
    </Slide>
  );
};

export default Signalement;
