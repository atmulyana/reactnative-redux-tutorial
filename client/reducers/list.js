import {GET_LIST, LIST_LOADED, REFRESH_LIST} from '../actions/types';
import INITIAL_STATE from './init-state';

export default function getList(state = INITIAL_STATE.list, action) {
    switch (action.type) {
        case GET_LIST: 
            return { ...state, loading: true};
        case LIST_LOADED:
            return {
                loading: false,
                refreshing: false,
                data: action.data ?? state.data,
            };
        case REFRESH_LIST:
            return { ...state, refreshing: true };
        default:
            return state;
    }
}