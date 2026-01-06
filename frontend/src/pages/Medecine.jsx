import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';


function Medecine() {
  const [isNewMedecineOpen , setIsNewMedecineOpen] = useState(false)

    // fonction pour ouvrir/fermer le menu
    const toggleNewMedecine = () => {
        setIsNewMedecineOpen(!isNewMedecineOpen)
    }

    useEffect(() => {
        if (isNewMedecineOpen) {
            document.documentElement.classList.add('menu-active');
        } else {
            document.documentElement.classList.remove('menu-active');
        }
    }, [isNewMedecineOpen]);

  return (
    <div className="medecine">
      <h1>Liste médicaments</h1>

      <div className="list">

        <div className="container_medecine">
          <div className="principal_infos">
            <div>
              <p>Xanax</p>
              <p>Comprimé / Gélule</p>
            </div>
            <div>
              <progress max="100" value="70">70%</progress>
              <p></p>
            </div>
          </div>

          <div className="drop">
            <p>Description lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            <div>
              <button>Supprimer</button>
              <button>Ajouter stock</button>
            </div>
          </div>
        </div>

        <div className="container_medecine">
          <div className="principal_infos">
            <div>
              <p>Xanax</p>
              <p>Comprimé / Gélule</p>
            </div>
            <div>
              <progress max="100" value="70">70%</progress>
              <p></p>
            </div>
          </div>
        </div>

        <div className="container_medecine">
          <div className="principal_infos">
            <div>
              <p>Xanax</p>
              <p>Comprimé / Gélule</p>
            </div>
            <div>
              <progress max="100" value="70">70%</progress>
              <p></p>
            </div>
          </div>
        </div>

        <button>open</button>

      </div>



      <Slide title={"hassoul"} isOpen={isNewMedecineOpen} onClickNewMedecine={toggleNewMedecine}>
        <p>hello</p>
      </Slide>

    </div>
  )
}

export default Medecine