export const getFormatDate = (date) => {    
    // options formatage
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('fr-FR', options);
}