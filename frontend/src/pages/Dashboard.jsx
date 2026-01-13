import { useEffect, useState } from 'react'

function Dashboard() {
  const [medicaments, setMedicaments] = useState([])
  const [error, setError] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchMedicaments = async () => {
    fetch(`${apiUrl}/?route=medicament/list`)
      .then((response) => {
        return response.json() // recupere les données$
      })
      .then((data) => {
      // on verifie si data est un tableau
      if (Array.isArray(data)) {
        setMedicaments(data);
        setError(null);
      } else if (data.error) {
        setError(data.error);
        setMedicaments([]); // On remet à vide pour éviter le crash du .map()
      }
    })
    .catch((err) => {
      console.error("Erreur de récupération:", err);
      setError("Impossible de contacter le serveur");
      setMedicaments([]);
    });
  }

  const handleDelete = async (id) => {
      try {
        const response = await fetch(`${apiUrl}/?route=medicament/delete`, {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ id: id }) 
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
      <h1>Journal de bord</h1>

      {medicaments.length === 0 ? (
        <p className="aucun">Aucun médicament</p>
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
            <tr key={m.id_medicament}>
              <td>{m.id_medicament}</td>
              <td>{m.nomMedicament}</td>
              <td>{m.stock}</td>
              <td>
                <button 
                  onClick={() => handleDelete(m.id_medicament)} 
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