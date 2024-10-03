import moment from 'moment';

import styles from './MovieCalendar.module.css';

import Button from '../../UI/Button/Button';

const MovieCalendar = (props) => {

    const { selectedDate, dateChangeHandler } = props;

    const calendar = [];

    const today = new Date();

    if((today.getHours() + 2) < 23){
        calendar.push(today);
    }

    for(let i = 1; i <= 7; i++){
        let nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + i);
        nextDay.setHours(0, 0, 0);
        calendar.push(nextDay);
    }

    let dateClasses = styles['calendar-date'];

    let selectedDateClasses = styles['calendar-date'] + ' ' + styles['selected'];

    return (
        <div className={styles['calendar']} >
            {
                calendar.map((date, index) => {

                    let formatSelectedDate = moment(new Date(selectedDate)).format('YYYY-MM-DD');
                    let formatDate = moment(new Date(date)).format('YYYY-MM-DD');

                    return (
                        <Button 
                            key={index} 
                            type="button" 
                            className={formatSelectedDate === formatDate ? selectedDateClasses : dateClasses} 
                            onClick={() => {dateChangeHandler(date)}}
                        >
                            <p className={styles['date-day-name']} >{moment(date).format('ddd').toUpperCase()}</p>
                            <p className={styles['date-number']} >{moment(date).format('DD')}</p>
                            <p className={styles['date-month']} >{moment(date).format('MMM').toUpperCase()}</p>
                        </Button>
                    )
                })
            }
        </div>
    );
}

export default MovieCalendar;