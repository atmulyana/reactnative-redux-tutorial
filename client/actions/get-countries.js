import {GET_COUNTRIES, COUNTRIES_LOADED} from './types';
import callServer from './server-conn';

export function getCountries() {
    return {
        type: GET_COUNTRIES,
    };
}

export function countriesLoaded(data) {
    return {
        type: COUNTRIES_LOADED,
        data
    }
}

export default function fetchCountries() {
    return function(dispatch) {
        dispatch(getCountries());

        callServer('countries').then(data => {
            dispatch(countriesLoaded(data || []));
        });
    };
}