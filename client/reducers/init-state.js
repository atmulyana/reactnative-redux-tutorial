const INITIAL_STATE = {
    list: {
        loading: false,
        refreshing: false,
        data: []
    },
    form: {
        loading: false,
        error: null,
        Id: null,
        Name: null,
        Age: null,
        Gender: null,
        CountryId: null,
    },
    countries: {
        loaded: false,
        data: [],
    },
};

export default INITIAL_STATE;