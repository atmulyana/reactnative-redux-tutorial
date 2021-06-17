import {GET_COUNTRIES, COUNTRIES_LOADED} from '../actions/types';
import INITIAL_STATE from './init-state';

export default function getCountries(state = INITIAL_STATE.countries, action) {
    switch (action.type) {
        case GET_COUNTRIES:
            return {
                loaded: false,
                data: state.data,
            };
        case COUNTRIES_LOADED:
            return {
                loaded: true,
                data: action.data,
            };
        default:
            return state;
    }
}