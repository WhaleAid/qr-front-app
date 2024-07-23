export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export const daysLeft = (dateString: string): number => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.abs(Math.ceil(diff / (1000 * 60 * 60 * 24)));
}