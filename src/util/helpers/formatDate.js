export const getTime = (date) => {

    let hours = date.getHours();
    let minutes = date.getMinutes();

    let formatHours = hours > 12 ? hours % 12 : hours;

    if(formatHours === 0){
        formatHours = 12;
    }

    formatHours = formatHours < 10 ? '0' + formatHours : formatHours;

    let formatMinutes = minutes < 10 ? '0' + minutes : minutes;

    let time = formatHours + ':' + formatMinutes + ' ';

    time = hours >= 12 ? time + 'PM' : time + 'AM';

    return time;
}

export const getSeatNumber = (totalSeats, seat) => {

    const rows = Math.ceil(totalSeats / 20);

    const currRow = Math.ceil(seat / 20);

    const col = seat % 20;

    const seatNumber = `${String.fromCharCode(65 + (rows - currRow))}${col}`;

    return seatNumber;
}