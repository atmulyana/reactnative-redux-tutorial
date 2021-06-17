import {ADD_ITEM, EDIT_ITEM} from './types';

export function addItem() {
    return {
        type: ADD_ITEM,
    };
}

export function editItem(id) {
    return {
        type: EDIT_ITEM,
        id
    };
}