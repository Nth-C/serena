import { useEffect, useState } from 'react'

// 👇 On garde uniquement cette déclaration avec { user }
function Dashboard({ user }) {
  const [medicaments, setMedicaments] = useState([])
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchMedicaments = async () => {
    fetch(`${apiUrl}/?route=medicament/list`)
      .then((response) => {
        return response.json() 
      })
      .then((data) => {
      if (Array.isArray(data)) {
        setMedicaments(data);
        setError(null);
      } else if (data.error) {
        setError(data.error);
        setMedicaments([]); 
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
        body: JSON.stringify({ id: id }) 
      });

      const result = await response.json();

      if (result.success) {
        fetchMedicaments(); 
      } else {
        alert("Erreur: " + result.error);
      }

    } catch (error) {
      console.error("Erreur réseau:", error);
    } 
  }

  useEffect(() => {
    fetchMedicaments()
  }, []);

  return (
    <div className="accueil">
      {/* C'est ici que le nom s'affichera grâce à la prop user */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
      <h2>Bonjour, {(user && user.username ? user.username : user) || 'Invité'} ! 👋</h2>      </div>

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
              <th>Action</th>
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