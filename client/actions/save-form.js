import {ITEM_SAVING, ITEM_SAVED} from './types';
import callServer from './server-conn';

export function itemSaving(data) {
    return {
        type: ITEM_SAVING,
        data
    }
}

export function itemSaved(data, error=null) {
    return {
        type: ITEM_SAVED,
        data,
        error
    }
}

export default function saveItem(data, callback) {
    return function(dispatch) {
        dispatch(itemSaving(data));

        callServer('person', {
            method: data.Id ? 'POST' : 'PUT',
            body: data
        })
        .then(data => {
            if (data === false) {
                let err = 'Error';
                dispatch(itemSaved(data, err));
                callback(err);
            }
            else {
                dispatch(itemSaved(data));
                callback(null);
            }
        });
    };
}