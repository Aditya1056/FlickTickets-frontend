import { useState, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

import styles from './Dropdown.module.css';

const Dropdown = (props) => {

    const [showList, setShowList] = useState(false);

    const ref = useRef();

    const toggleList = () => {
        setShowList((prev) => !prev);
    }

    const {selectedItems, itemsList, addItem, removeItem} = props;

    return (
        <div className={styles['dropdown']}>
            <div className={styles['selected-items']} >
                {
                    selectedItems.length === 0 && 
                    <p className={styles['none-text']} >--None--</p>}
                {
                    selectedItems.length > 0 && 
                    <ul className={styles['selected-items-list']} >
                        {
                            selectedItems.map((item, index) => {
                                return (
                                    <li key={index} className={styles['selected-item']} >
                                        <p>{item.value}</p>
                                        <button 
                                            type="button" 
                                            onClick={() => {removeItem(index)}} 
                                        >
                                            <IoClose />
                                        </button>
                                    </li>
                                );
                            })
                        }
                    </ul>
                }
                <motion.button 
                    type="button" 
                    className={styles['arrow-btn']} 
                    animate={showList ? {rotate: 180} : {rotate: 0}} 
                    transition={{duration: 0.4, type:"spring"}}
                    onClick={toggleList} 
                >
                    <IoIosArrowDown />
                </motion.button>
            </div>
            <AnimatePresence>
                {
                    showList && 
                    <motion.div 
                        key="list-content" 
                        ref={ref} 
                        className={styles['all-items']} 
                        initial={{opacity:0, y:"-5%"}} 
                        animate={{opacity:1, y:"0%"}} 
                        exit={{opacity:0, y:"-5%"}} 
                        transition={{duration: 0.3, type:"keyframes"}} 
                    >
                        <ul className={styles['all-items-list']} >
                            {
                                itemsList.map((item, index) => {
                                    return (
                                        <li 
                                            key={index} 
                                            className={styles['list-item']} 
                                            onClick={() => {addItem(index)}} 
                                        >
                                            {item.value}
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
}

export default Dropdown;