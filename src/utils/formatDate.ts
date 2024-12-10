import {format} from 'date-fns';

const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm:ss dd/MM/yyyy');
};

export default formatDate;
