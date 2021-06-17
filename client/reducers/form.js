import {ADD_ITEM, EDIT_ITEM, /*GET_ITEM,*/ ITEM_LOADED, ITEM_SAVING, ITEM_SAVED, ITEM_DELETING, ITEM_DELETED} from '../actions/types';
import INITIAL_STATE from './init-state';

export default function processForm(state = INITIAL_STATE.form, action) {
    let data = {
        loading: false,
        error: null,
        Id: null,
        Name: null,
        Age: null,
        Sex: null,
        CountryId: null,
    };
    switch (action.type) {
        case EDIT_ITEM:
            data.Id = action.id;
            data.loading = true;
        case ADD_ITEM:
            return data;
        case ITEM_LOADED:
            if (!action.data) return data;
            return { ...action.data, loading: false, error: null};
        case ITEM_SAVING:
            return { ...action.data, loading: true, error: null};
        case ITEM_SAVED:
            return { ...action.data, loading: false, error: action.error};
        case ITEM_DELETING:
            return { ...state, loading: true, error: null };
        case ITEM_DELETED:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
}