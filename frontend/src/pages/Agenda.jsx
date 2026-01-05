import { useEffect, useState } from 'react'

function Agenda() {
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nouveauMedoc = {
      name: name,
      stock: stock
    }

    try {
      const response = await fetch(`${apiUrl}/?route=medicament/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauMedoc)
      });

      const result = await response.json();

      if (result.success) {
        // reset le formulaire
        setName('');
        setStock('');
      } else {
        setMessage("Erreur: " + result.error);
      }
    } catch (error) {
      setMessage("Erreur réseau");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestion des Médicaments</h2>

      <section style={{ marginBottom: '40px', border: '1px solid #ccc' }}>
        <h3>Ajouter un nouveau médicament</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom : </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <br />
          <div>
            <label>Stock : </label>
            <input 
              type="number" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)} 
              required 
            />
          </div>
          <br />
          <button type="submit">Enregistrer</button>
        </form>
        {message && <p>{message}</p>}
      </section>
    </div>
  );
};

export default Agenda