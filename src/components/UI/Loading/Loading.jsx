import styles from "./Loading.module.css";

import Backdrop from "../Backdrop/Backdrop";

const Loading = (props) => {
    return (
        <>
            <Backdrop zIndex={80} />
            <div className={styles['loading-container']} >
                <div className={styles['loading-box']} >
                    <div className={styles['loading-spinner']} />
                </div>
            </div>
        </>
    );
}

export default Loading;