import { RxDoubleArrowLeft } from "react-icons/rx";
import { RxDoubleArrowRight } from "react-icons/rx";

import styles from './Pagination.module.css';

import Button from '../../UI/Button/Button';

const Pagination = (props) => {

    let firstPage = 1;
    let currPage = props.currPage;
    let lastPage = props.lastPage;
    let prevPage = currPage - 1;
    let nextPage = currPage + 1;

    return (
        <div className={styles['pagination']} >

            {
                currPage !== firstPage && 
                <>
                    <Button 
                        key="back-arrow" 
                        className={styles['backward-arrow-btn']} 
                        type="button" 
                        onClick={() => {props.pageChangeHandler(prevPage)}} 
                    >
                        <RxDoubleArrowLeft className={styles['backward-arrow-icon']} />
                    </Button>

                    <Button 
                        key="prev-page" 
                        className={styles['previous-page-btn']} 
                        type="button" 
                        onClick={() => {props.pageChangeHandler(prevPage)}} 
                    >
                        {prevPage} 
                    </Button>
                </>
            }

            <Button 
                key="curr-page"
                className={styles['current-page-btn']} 
                type="button" 
            >
                {currPage} 
            </Button>
            {
                currPage !== lastPage && 
                <>
                    <Button 
                        key="next-page"
                        className={styles['next-page-btn']} 
                        type="button" 
                        onClick={() => {props.pageChangeHandler(nextPage)}} 
                    >
                        {nextPage} 
                    </Button>

                    <Button 
                        key="forward-arrow" 
                        className={styles['forward-arrow-btn']} 
                        type="button" 
                        onClick={() => {props.pageChangeHandler(nextPage)}} 
                    >
                        <RxDoubleArrowRight className={styles['forward-arrow-icon']} />
                    </Button>
                </>
            }
        </div>

    );
}

export default Pagination;