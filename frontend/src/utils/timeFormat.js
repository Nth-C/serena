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

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}