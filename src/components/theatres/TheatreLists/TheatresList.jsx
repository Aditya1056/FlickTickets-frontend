import styles from './TheatresList.module.css';

import TheatreItem from './TheatreItem';

const TheatresList = (props) => {

    const theatres = props.theatres;

    return (
        <ul className={styles['theatres-list']} >
            <li key="headings" className={styles['theatre-item-header']} >
                <div className={styles['name-heading']} >
                    <h5>Theatre</h5>
                </div>
                <div className={styles['address-heading']} >
                    <h5>Address</h5>
                </div>
                {
                    !props.userTheatres && 
                    <div className={styles['owner-heading']} >
                        <h5>Owned by</h5>
                    </div>
                }
                <div className={styles['phone-heading']} >
                    <h5>Phone</h5>
                </div>
                {
                    props.userTheatres &&  
                    <div className={styles['status-heading']} >
                        <h5>Status</h5>
                    </div>
                }
                <div className={styles['actions-heading']} >
                    <h5>Actions</h5>
                </div>
                {
                    (props.allTheatres || props.userTheatres) &&  
                    <div className={styles['info-heading']} >
                        <h5>Info</h5>
                    </div>
                }
            </li>
            {
                theatres.map((theatre, index) => {
                    return (
                        <TheatreItem 
                            key={index} 
                            id={theatre._id} 
                            name={theatre.name} 
                            address={theatre.address} 
                            owner={theatre.owner} 
                            phone={theatre.phone} 
                            isApproved={theatre.isApproved} 
                            requests={props.requests} 
                            allTheatres={props.allTheatres} 
                            userTheatres={props.userTheatres} 
                        />
                    );
                })
            }
        </ul>
    );
}

export default TheatresList;