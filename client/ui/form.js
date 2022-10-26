import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {setStatusStyleDefault, ValidationContext, withValidation} from 'react-native-form-input-validator';
import {integer, numeric, regex, required, rule} from 'react-native-form-input-validator/rules';
import RootView from './rootView';
import Button from './button';
import LoadingIndicator from './loadingIndicator';
import RadioForm from 'react-native-simple-radio-button';
import fetchItem from '../actions/get-item';
import fetchCountries from '../actions/get-countries';
import saveItem from '../actions/save-form';
import deleteItem from '../actions/delete-form';
import {refreshList} from '../actions/list';


class RadioGender extends Component {
    #element = React.createRef();
    #onPress;

    constructor(props) {
        super(props);
        this.#onPress = gender => {
            const value = gender && gender.value || gender;
            if (typeof(this.props.onPress) == 'function') this.props.onPress(value);
        }
    }

    get value() {
        return this.#element
    }

    componentDidMount() {
        if (typeof(this.props.index) == 'number') {
            this.#element.current.updateIsActiveIndex(this.props.index);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.index != this.props.index) this.#element.current.updateIsActiveIndex(this.props.index);
    }
    
    render() {
        const style = StyleSheet.flatten(this.props.style),
              extProps = {};
        if (style?.color) {
            extProps.buttonColor = extProps.labelColor  = style.color;
        }
        return (<RadioForm
            {...extProps}
            ref={this.#element}
            radio_props={[{value:'M', label:'Male  '}, {value:'F', label:'Female'}]}
            initial={-1}
            formHorizontal={true}
            animation={false}//android
            onPress={this.#onPress}
        />);
    }
}

const NameInput = withValidation(TextInput, {
    rules: [
        required,
        regex(/^[a-zA-Z']+( [a-zA-Z']+)*$/),
    ],
    setStatusStyle: setStatusStyleDefault,
});
const AgeInput = withValidation(TextInput, {
    rules: [required, numeric, integer],
    setStatusStyle: setStatusStyleDefault,
});
const GenderInput = withValidation(RadioGender, {
    getValue: props => props.index,
    rules: rule(
        index => index === 0 || index === 1,
        'required'
    ),
    setStatusStyle: setStatusStyleDefault,
});
const CountryInput = withValidation(Picker, {
    getValue: props => props.selectedValue,
    rules: required,
})

class FormPage extends Component {
    #validationRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {...props.data};
        delete this.state.loading;
        delete this.state.error;
    }

    componentDidMount() {
        const {dispatch} = this.props;
        const {Id} = this.state;
        dispatch(fetchCountries());
        if (Id) {
            dispatch(fetchItem(Id,
                data => {
                    let data2 = { ...data };
                    delete data2.loading;
                    delete data2.error;
                    this.setState(data2);
                }
            ));
        }
    }

    _save() {
        if (!this.#validationRef.current?.validate()) return;
        this.props.dispatch(saveItem(this.state,
            err => {
                if (err) Alert.alert('Error saving data');
                else this._back();
            }
        ));
    }

    _delete() {
        Alert.alert(
            'Delete Data',
            'Are you sure to delete this person?',
            [
                {text: 'Yes', onPress: () => {
                    this.props.dispatch(deleteItem(this.state.Id,
                        err => {
                            if (err) Alert.alert('Error deleting data');
                            else this._back();
                        }
                    ));
                }},
                {text: 'No', style: 'cancel'},
            ]
        );
    }

    _back() {
        this.props.dispatch(refreshList());
        this.props.navigation.navigate('List');
    }
    
    render() {
        const data = this.state;
        let genderIdx = data.Gender == 'M' ? 0 :
                        data.Gender == 'F' ? 1 :
                        -1;
        return <RootView style={styles.container}>
            <ScrollView style={styles.content}>
                <ValidationContext ref={this.#validationRef}>
                    <Text style={styles.inputLabel}>Name:</Text>
                    <NameInput value={data.Name} maxLength={30} onChangeText={Name => this.setState({Name})} style={styles.input} />

                    <Text style={styles.inputLabel}>Age:</Text>
                    <AgeInput value={(data.Age||'')+''} maxLength={3} keyboardType='number-pad' onChangeText={Age => this.setState({Age}) } style={styles.input} />

                    <Text style={styles.inputLabel}>Gender:</Text>
                    <GenderInput index={genderIdx} onPress={Gender => this.setState({Gender})} />
                    
                    <Text style={styles.inputLabel}>Country:</Text>
                    <CountryInput selectedValue={data.CountryId} style={styles.input} onValueChange={CountryId => this.setState({CountryId})}>
                        <Picker.Item value={''} label={'-- Please Choose --'} />
                        {this.props.countries.map((country, idx) => <Picker.Item key={idx} value={country.Id} label={country.Name} />)}
                    </CountryInput>
                </ValidationContext>
                <View style={styles.btnGroup}>
                    <Button title="Save" onclick={() => this._save()} disabled={this.props.loading} />
                    {data.Id && (
                        <Button color='red' title="Delete" onclick={() => this._delete()} disabled={this.props.loading} />
                    )}
                    <Button title="Go Back" onclick={() => {this.props.navigation.goBack()}} disabled={this.props.loading} />
                </View>
            </ScrollView>
            <LoadingIndicator loading={this.props.loading} style={{top: 40}} />
        </RootView>;
    }
}

const styles = StyleSheet.create({
    container: {padding: 16, backgroundColor: '#eee'},
    content: {flex: 1},
    btnGroup: {flexDirection: 'row'},
    input: {borderColor: 'black', borderWidth: 1, color: 'black', marginBottom: 4, marginTop: 0, padding: 2},
    inputLabel: {fontWeight: 'bold'},
});

export default connect(
    state => ({
        data: {...state.form},
        loading: state.form.loading || !state.countries.loaded,
        countries: state.countries.data,
    }),
    (dispatch, props) => ({
        ...props,
        dispatch
    })
)(FormPage);