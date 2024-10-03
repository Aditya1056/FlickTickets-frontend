import { NavLink } from 'react-router-dom';

import styles from './NavItem.module.css';

import { useAuthContext } from '../../../../store/authContext';

const NavItem = (props) => {

    const auth = useAuthContext();

    return (
        <li className={styles['nav-item']} >
            <NavLink 
                className={({isActive}) => {
                    return isActive ? styles.active : undefined;
                }} 
                to={props.to} 
            >
                {props.value} 
            </NavLink>
            {
                (props.to === '/theatre-requests' && auth.theatreRequests > 0) && 
                <span className={styles['requests-count']} >{auth.theatreRequests <= 10 ? auth.theatreRequests :  "10+"}</span>
            }
        </li>
    );
}

export default NavItem;