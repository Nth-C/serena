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