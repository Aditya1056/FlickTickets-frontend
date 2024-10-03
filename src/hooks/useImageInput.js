import { useEffect, useReducer } from "react";

const initialInputState = {
    value: null,
    previewUrl:null,
}

const reducerFn = (state, action) => {

    const updatedState = {...state};

    if(action.type === 'NEW_VAL'){
        updatedState.value = action.payload;
    }
    else if(action.type === 'PREVIEW'){
        updatedState.previewUrl = action.payload;
    }
    else if(action.type === 'RESET'){
        updatedState.value = null;
        updatedState.previewUrl = null;
    }

    return updatedState;
}

const useImageInput = (validator, presentState) => {

    let initialState = {...initialInputState};

    if(presentState){
        initialState = {...presentState};
    }

    const [inputState, dispatch] = useReducer(reducerFn, initialState);

    const inputIsValid = validator({val: inputState.value});

    const inputIsInvalid = !inputIsValid;

    const inputChangeHandler = (event) => {
        if(event.target.files && event.target.files.length === 1){
            dispatch({type: 'NEW_VAL', payload: event.target.files[0]});
        }
    }

    const inputResetHandler = (event) => {
        dispatch({type:'RESET'});
    }

    useEffect(() => {

        if(inputState.value){
            const fileReader = new FileReader();
    
            fileReader.onload = () => {
                dispatch({type:'PREVIEW', payload: fileReader.result});
            }
            
            fileReader.readAsDataURL(inputState.value);
        }
        else{
            dispatch({type:'PREVIEW', payload: null});
        }
    }, [inputState.value]);

    return {
        value: inputState.value,
        previewUrl:inputState.previewUrl,
        isValid: inputIsValid,
        isInvalid: inputIsInvalid,
        inputChangeHandler,
        inputResetHandler
    };
}

export default useImageInput;