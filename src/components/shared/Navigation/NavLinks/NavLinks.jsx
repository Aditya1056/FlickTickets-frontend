import { useState } from "react";

import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";

import styles from './NavLinks.module.css';

import NavItem from './NavItem';

import { useAuthContext } from '../../../../store/authContext';

import userProfileImage from '../../../../assets/profile.png';

const NavLinks = (props) => {

    const auth = useAuthContext();

    const location = useLocation();

    const [ selectedTheatreLink, setSelectedTheatreLink ] = useState("Theatres");
    const [ showTheatreList, setShowTheatreList ] = useState(false);

    const changeTheatreLinkHandler = (value) => {
        setSelectedTheatreLink(value);
        toggleTheatreList();
    }

    const toggleTheatreList = () => {
        setShowTheatreList((prev) => !prev);
    }

    return(
        <>
            {
                props.leftNav && 
                <ul className={styles['nav-links']} >
                    <NavItem to="/movies" value="Movies" />
                    {
                        auth.userRole === "partner" && 
                        <NavItem to="/mytheatres" value="My Theatres" />
                    }
                    {
                        auth.userRole === "admin" && props.mainNav && 
                        <div className={styles['navlink-dropdown']} >
                            <div 
                                className={styles['selected-navlink']} 
                                style={
                                    location.pathname === '/mytheatres' || location.pathname === '/theatres' ? {color: 'rgb(54, 200, 125)'} : undefined 
                                }
                                onClick={toggleTheatreList} 
                            >
                                {selectedTheatreLink} 
                                <motion.span 
                                    className={styles['arrow']} 
                                    animate={showTheatreList ? {rotate:180} : {rotate: 0}} 
                                >
                                    <IoIosArrowDown  />
                                </motion.span>
                            </div>
                            <AnimatePresence>
                                {
                                    showTheatreList && 
                                    <motion.div 
                                        key="nav-dropdown-list" 
                                        className={styles['navlinks-display']} 
                                        initial={{opacity:0, y:"-5%"}} 
                                        animate={{opacity:1, y:"0%"}} 
                                        exit={{opacity:0, y:"-5%"}} 
                                    >
                                        <NavLink 
                                            to="/theatres" 
                                            onClick={() => {changeTheatreLinkHandler("Theatres")}} 
                                            className={({isActive}) => isActive ? styles['active'] : undefined} 
                                        >
                                            Theatres
                                        </NavLink>
                                        <NavLink 
                                            to="/mytheatres" 
                                            onClick={() => {changeTheatreLinkHandler("My Theatres")}} 
                                            className={({isActive}) => isActive ? styles['active'] : undefined}  
                                        >
                                            My Theatres
                                        </NavLink>
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                    }
                    {
                        auth.userRole === "admin" && props.sideDrawer && 
                        <>
                            <NavItem to="/theatres" value="Theatres" />
                            <NavItem to="/mytheatres" value="My Theatres" />
                        </>
                    }
                    {
                        auth.userRole === 'admin' && 
                        <NavItem to="/theatre-requests" value="Theatre Requests" />
                    }
                    <NavItem to="/bookings" value="Bookings" />
                </ul>
            }
            {
                props.rightNav && 
                <ul className={styles['nav-links']} >
                    <div className={styles['user-details']} >
                        <NavLink 
                            to="/profile" 
                            className={({isActive}) => {
                                return isActive ? styles.active : undefined;
                            }} 
                            title="profile" 
                        >
                            <img src={auth.userImage ? auth.userImage : userProfileImage} alt={"profile"} />
                            <p>{auth.userName}</p>
                        </NavLink>
                    </div>
                    <button 
                        type="button"  
                        className={styles['logout-btn']} 
                        onClick={auth.logout} 
                        title="logout" 
                    >
                        <span>Logout</span><AiOutlineLogout />
                    </button>
                </ul>
            }
        </>
    );
}

export default NavLinks;