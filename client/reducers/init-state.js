const INITIAL_STATE = {
    list: {
        loading: true,
        data: []
    },
    form: {
        loading: false,
        error: null,
        Id: null,
        Name: null,
        Age: null,
        Sex: null,
        CountryId: null,
    },
    countries: {
        loaded: false,
        data: [],
    },
};

export default INITIAL_STATE;