import { useEffect, useState } from 'react'

function LastVisitReport() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/?route=rapport/home`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setRapports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="last_visit_report">
      {rapports.map((rapport) => (
        <div key={rapport.id_rapport} className="report_container">
          
          {/* Ligne : Nom du rapport et Heure */}
          <div className="report_header">
            <h2>{rapport.nom}</h2>
            <p className="time">{rapport.heure.substring(0, 5)}</p>
          </div>

          {/* Section Médicaments */}
          <div className="report_section">
            <h3>Médicaments pris :</h3>
            <div className="medics_list">
              {rapport.medics_details && rapport.medics_details.length > 0 ? (
                <ul>
                  {rapport.medics_details.map((m, i) => (
                    <li key={i}>
                      <strong>{m.quantite}</strong> {m.nom}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun médicament pris.</p>
              )}
            </div>
          </div>

          {/* Section Notes (Description) */}
          <div className="report_section">
            <h3>Notes :</h3>
            <p className="description">{rapport.description}</p>
          </div>

        </div>
      ))}
    </div>
  )
}

export default LastVisitReport