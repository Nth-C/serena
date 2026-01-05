import { useEffect, useState } from 'react'

function Dashboard() {
  const [medicaments, setMedicaments] = useState([])
  const [error, setError] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchMedicaments = async () => {
    fetch(`${apiUrl}/?route=medicament/list`)
      .then((response) => {
        return response.json() // recupere les données
      })
      .then((data) => {
        setMedicaments(data)
      })
      .catch((err) => {
        console.error("Erreur de récupération:", err)
        setError(err.message)
      });

    if (error !== null) {
      return <div style={{ color: 'red' }}>Erreur : {error}</div>
    } 
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/?route=medicament/delete`, {
        method: "POST", // pour envoyer des données
        headers: { "Content-Type": "application/json" }, // type de donnée envoyer
        body: JSON.stringify({ id: id }) // message a transmettre
      });

      // recupere la reponse du fetch
      const result = await response.json();

      if (result.success) {
        // rafrechir les medicaments
        fetchMedicaments(); 
      } else {
        alert("Erreur: " + result.error);
      }

    } catch (error) {
      console.error("Erreur réseau:", error);
    } 
  }

  // quand la page se lance on affiche les medicaments
  useEffect(() => {
    fetchMedicaments()
  }, []);

  return (
    <div className="accueil">
      <h1>Stock</h1>

      {medicaments.length === 0 ? (
        <p>Aucun médicament</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {medicaments.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.stock}</td>
              <td>
                <button 
                  onClick={() => handleDelete(m.id)} 
                  style={{ backgroundColor: 'var(--red)', color: 'var(--white)' }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Dashboard