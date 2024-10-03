import ReactDOM from "react-dom";

import styles from './Backdrop.module.css';

const Backdrop = (props) => {

    const zIndex = props.zIndex ? props.zIndex : 30;

    let content =  (
        <div 
            className={styles['backdrop']} onClick={props.onClick} 
            style={{zIndex}} 
        />
    );

    return ReactDOM.createPortal(content, document.getElementById('backdrop'));
}

export default Backdrop;