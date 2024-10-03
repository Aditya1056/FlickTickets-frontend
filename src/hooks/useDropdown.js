import { useReducer, useEffect } from "react";

import { useToastContext } from "../store/toastContext";

const inputReducer = (state, action) => {

    let updatedSelectedItems = [...state.selectedItems];
    let updatedListItems = [...state.listItems];

    if(action.type === 'ADD_VAL'){

        const index = action.payload;

        updatedSelectedItems.push(updatedListItems[index]);
        updatedListItems.splice(index, 1);
    }
    else if(action.type === 'REMOVE_VAL'){

        const index = action.payload;
    
        updatedListItems.push(updatedSelectedItems[index]);
        updatedSelectedItems.splice(index, 1);
    }
    else if(action.type === 'SET_LIST'){
        updatedListItems = action.payload.filter((item) => {
            
            if(item.id){

                const existingItem = updatedSelectedItems.findIndex((selectedItem) => {
                    return selectedItem.id === item.id;
                })

                if(existingItem === -1){
                    return item;
                }
            }
            else{
                const existingItem = updatedSelectedItems.findIndex((selectedItem) => {
                    return selectedItem.value === item.value;
                })
    
                if(existingItem === -1){
                    return item;
                }
            }
        });
    }
    else if(action.type === 'RESET'){

        updatedListItems = [];
        updatedSelectedItems = [];
    }

    return {
        selectedItems: updatedSelectedItems, 
        listItems: updatedListItems
    };
}

const useDropdown = (validator, list, minLength, limit, presentState) => {

    const toast = useToastContext();

    const initialState = presentState ? {
        selectedItems:[...presentState.selectedItems], 
        listItems: [...presentState.listItems]
    } : {
        selectedItems: [],
        listItems:[...list]
    };

    const [itemsState, dispatch] = useReducer(inputReducer, initialState);

    const itemsValid = validator({values: itemsState.selectedItems, minLength: minLength});

    const addItemHandler = (index) => {

        if(itemsState.selectedItems.length === limit){
            toast.openToast('FAIL', `Only ${limit} options can be selected`);
            return;
        }

        dispatch({type:'ADD_VAL', payload: index});
    }

    const removeItemHandler = (index) => {

        if(itemsState.selectedItems.length === 0){
            return;
        }

        dispatch({type:'REMOVE_VAL', payload: index});
    }

    const resetItemsHandler = () => {
        dispatch({type: 'RESET'});
    }

    useEffect(() => {
        if(list && list.length > 0 && itemsState.listItems.length === 0){
            dispatch({type:'SET_LIST', payload:list});
        }
    }, [list]);

    return {
        selectedItems: itemsState.selectedItems,
        listItems: itemsState.listItems,
        itemsValid,
        addItemHandler,
        removeItemHandler,
        resetItemsHandler
    };
}

export default useDropdown;