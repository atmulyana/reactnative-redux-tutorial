import {/*GET_ITEM,*/ ITEM_LOADED} from './types';
import callServer from './server-conn';

// export function getItem(id) {
//     return {
//         type: GET_ITEM,
//         id
//     };
// }

export function itemLoaded(data) {
    return {
        type: ITEM_LOADED,
        data
    };
}

export default function fetchItem(id, callback) {
    return function(dispatch) {
        // dispatch(getItem(id));

        callServer('person/' + id).then(data => {
            dispatch(itemLoaded(data));
            if (callback) callback(data);
        });
    };
}