import {ITEM_DELETING, ITEM_DELETED} from './types';
import callServer from './server-conn';

export function itemDeleting(id) {
    return {
        type: ITEM_DELETING,
        id
    }
}

export function itemDeleted(id, error=null) {
    return {
        type: ITEM_DELETED,
        id,
        error
    }
}

export default function deleteItem(id, callback) {
    return function(dispatch) {
        dispatch(itemDeleting(id));

        callServer('person/' + id, 'DELETE')
        .then(data => {
            if (data === false) {
                let err = 'Error';
                dispatch(itemDeleted(id, err));
                callback(err);
            }
            else {
                dispatch(itemDeleted(id));
                callback(null);
            }
        });
    };
}