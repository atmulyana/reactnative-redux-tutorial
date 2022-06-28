import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
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
    element = React.createRef();

    componentDidMount() {
        if (typeof(this.props.index) == 'number') {
            this.element.current.updateIsActiveIndex(this.props.index);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.index != this.props.index) this.element.current.updateIsActiveIndex(this.props.index);
    }
    
    render() {
        return (<RadioForm
            ref={this.element}
            radio_props={[{value:'M', label:'Male  '}, {value:'F', label:'Female'}]}
            initial={-1}
            formHorizontal={true}
            onPress={this.props.onPress} />
        );
    }
}

class FormPage extends Component {
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
        const data = this.state;
        if (!(data.Name||'').trim()) {
            Alert.alert('Validation', 'Please fill Name');
            return;
        }
        if (!data.Age) {
            Alert.alert('Validation', 'Please fill Age');
            return;
        }
        if (!/^[0-9]+$/.test(data.Age)) {
            Alert.alert('Validation', 'Age value is invalid');
            return;
            
        }
        if (!data.Gender) {
            Alert.alert('Validation', 'Please choose the Gender');
            return;
        }
        if (!data.CountryId) {
            Alert.alert('Validation', 'Please choose the Coutry');
            return;
        }

        this.props.dispatch(saveItem(data,
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
        
        return <RootView style={styles.container}><ScrollView style={styles.content}>
            <Text style={styles.inputLabel}>Name:</Text>
            <TextInput value={data.Name} maxLength={30} onChangeText={Name => this.setState({Name})} style={styles.input} />

            <Text style={styles.inputLabel}>Age:</Text>
            <TextInput value={(data.Age||'')+''} maxLength={3} keyboardType='number-pad' onChangeText={Age => this.setState({Age}) } style={styles.input} />

            <Text style={styles.inputLabel}>Gender:</Text>
            <RadioGender index={genderIdx} onPress={gender => this.setState({Gender: gender && gender.value || gender})} />
            
            <Text style={styles.inputLabel}>Country:</Text>
            <Picker selectedValue={data.CountryId} style={styles.input} onValueChange={CountryId => this.setState({CountryId})}>
                <Picker.Item value={''} label={'-- Please Choose --'} />
                {this.props.countries.map((country, idx) => <Picker.Item key={idx} value={country.Id} label={country.Name} />)}
            </Picker>

            <View style={styles.btnGroup}>
                <Button title="Save" onclick={() => this._save()} disabled={this.props.loading} />
                {data.Id && (
                    <Button color='red' title="Delete" onclick={() => this._delete()} disabled={this.props.loading} />
                )}
                <Button title="Go Back" onclick={() => {this.props.navigation.goBack()}} disabled={this.props.loading} />
            </View>
            
            <LoadingIndicator loading={this.props.loading} style={{top: 40}} />
        </ScrollView></RootView>;
    }
}

const styles = StyleSheet.create({
    container: {padding: 16, backgroundColor: '#eee'},
    content: {flex: 1},
    btnGroup: {flexDirection: 'row'},
    input: {borderWidth: 1, marginBottom: 4, marginTop: 0, padding: 2},
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