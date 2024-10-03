export const inputValidator = (data) => {

    let val = data.val;
    let minLength = data.minLength;

    if(val.trim().length < minLength){
        return false;
    }

    return true;
}

export const phoneValidator = (data) => {

    let val = String(data.val);
    let minLength = data.minLength;

    if(val.trim().length != minLength){
        return false;
    }

    return true;
}

export const notNullValidator = (data) => {
    
    let val = data.val;

    if(!val){
        return false;
    }

    return true;
}

export const listValidator = (data) => {
    
    let values = data.values;
    let minLength = data.minLength;

    if(!values || values.length < minLength){
        return false;
    }

    return true;
}