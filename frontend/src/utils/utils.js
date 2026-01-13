export const getFormatDate = (date, isAbbreviated = false) => {    
    const options = {
        weekday: isAbbreviated ? 'short' : 'long',
        day: 'numeric',
        month: isAbbreviated ? 'short' : 'long',
        year: 'numeric'
    };

    let formattedDate = date.toLocaleDateString('fr-FR', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export const getFormatTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
        return "Heure invalide";
    }

    // Récupère les heures et minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Ajoute un "0" devant si le chiffre est inférieur à 10 pour avoir "08" au lieu de "8"
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}