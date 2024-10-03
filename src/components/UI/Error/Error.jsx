import { MdOutlineError } from "react-icons/md";

import styles from './Error.module.css';

const Error = (props) => {

    const marginTop = props.marginTop ? props.marginTop : "0.5rem";

    return (
        <div 
            className={styles['error']} 
            style={{marginTop}} 
        >
            <p><MdOutlineError className={styles['error-icon']} /> {props.message}</p>
        </div>
    );
}

export default Error;