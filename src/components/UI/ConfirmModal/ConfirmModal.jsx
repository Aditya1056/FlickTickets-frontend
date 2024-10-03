import { motion } from 'framer-motion';

import styles from './ConfirmModal.module.css';

import Button from '../Button/Button';

const ConfirmModal = (props) => {

    return (
        <>
            <div className={styles['confirm-modal-container']} >
                <motion.div 
                    className={styles['confirm-modal']} 
                    initial={{opacity:0, y: '100%'}} 
                    animate={{opacity:1, y: '0%'}} 
                    exit={{opacity:0, y: '100%'}} 
                >
                    <div className={styles['confirm-modal-header']} >
                        <h4>{props.header}</h4>
                    </div>
                    <div className={styles['confirm-modal-message']}>
                        <p className={styles['message']} >{props.message}</p>
                    </div>
                    <div className={styles['confirm-modal-actions']} >
                        <Button 
                            key={"cancel-modal-btn"}
                            type="button" 
                            onClick={props.onCancel} 
                            className={styles['cancel-btn']}
                        >
                            Cancel
                        </Button>
                        <Button 
                            key={"confirm-modal-btn"} 
                            type="button" 
                            onClick={props.onConfirm} 
                            className={styles['confirm-btn']}
                        >
                            Confirm
                        </Button>
                    </div>
                </motion.div>
            </div>
        </>
    );

}

export default ConfirmModal;