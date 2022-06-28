import {GET_LIST, LIST_LOADED, REFRESH_LIST} from './types';
import callServer from './server-conn';

export function loadList() {
    return {
        type: GET_LIST,
    };
}

export function listLoaded(data) {
    return {
        type: LIST_LOADED,
        data
    };
}

export function refreshList() {
    return {
        type: REFRESH_LIST,
    };
}

export function fetchList() {
    return function(dispatch) {
        dispatch(loadList());
        
        callServer('people').then(data => {
            if (data !== false) {
                dispatch(listLoaded(data));
            }
            else {
                dispatch(listLoaded(null));
            }
        });
    };
}