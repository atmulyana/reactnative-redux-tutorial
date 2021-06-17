import { combineReducers } from 'redux';
import list from './list';
import form from './form';
import countries from './countries';

const rootReducer = combineReducers({
    list,
    form,
    countries
});
export default rootReducer;