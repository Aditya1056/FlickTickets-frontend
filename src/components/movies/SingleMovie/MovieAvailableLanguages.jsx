import styles from './MovieAvailableLanguages.module.css';

import Button from '../../UI/Button/Button';

const MovieAvailableLanguages = (props) => {

    const { selectedLanguage, languageChangeHandler, languages } = props;

    let languageClasses = styles['language-option'];

    let selectedLanguageClasses = styles['language-option'] + ' ' + styles['selected'];

    return (
        <div className={styles['available-languages']} >
            {
                languages.map((language, index) => {

                    return (
                        <Button 
                            key={`${index}${language}`} 
                            type="button" 
                            className={selectedLanguage === language ? selectedLanguageClasses : languageClasses} 
                            onClick={() => {languageChangeHandler(language)}} 
                        >
                            {language} 
                        </Button>
                    )
                })
            }
        </div>
    );
}

export default MovieAvailableLanguages;