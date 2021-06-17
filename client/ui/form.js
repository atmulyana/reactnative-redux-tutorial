import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Button from './button';
import RadioForm from 'react-native-simple-radio-button';
import fetchItem from '../actions/get-item';
import fetchCountries from '../actions/get-countries';
import saveItem from '../actions/save-form';
import deleteItem from '../actions/delete-form';
import {refreshList} from '../actions/list';


class RadioSex extends Component {
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
        if (!data.Sex) {
            Alert.alert('Validation', 'Please choose the Sex');
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
        this.props.navigation.navigate('List');
        this.props.dispatch(refreshList());
    }
    
    render() {
        if (this.props.loading)
            return (<View style={styles.container}>
                <ActivityIndicator />
            </View>);
        
        const data = this.state;
        let sexIdx = data.Sex == 'M' ? 0 :
                     data.Sex == 'F' ? 1 :
                     -1;
        
        return (<View style={styles.container}>
            <Text style={styles.inputLabel}>Name:</Text>
            <TextInput value={data.Name} maxLength={30} onChangeText={Name => this.setState({Name})} style={styles.input} />

            <Text style={styles.inputLabel}>Age:</Text>
            <TextInput value={(data.Age||'')+''} maxLength={3} keyboardType='number-pad' onChangeText={Age => this.setState({Age}) } style={styles.input} />

            <Text style={styles.inputLabel}>Sex:</Text>
            <RadioSex index={sexIdx} onPress={Sex => this.setState({Sex: Sex && Sex.value || Sex})} />
            
            <Text style={styles.inputLabel}>Country:</Text>
            <Picker selectedValue={data.CountryId} style={styles.input} onValueChange={(CountryId, idx) => this.setState({CountryId})}>
                {this.props.countries.map((country, idx) => <Picker.Item key={idx} value={country.Id} label={country.Name} />)}
            </Picker>

            <View style={styles.btnGroup} h>
                <Button title="Save" onclick={() => this._save()} disabled={this.props.loading} />
                {data.Id && (
                    <Button color='red' title="Delete" onclick={() => this._delete()} disabled={this.props.loading} />
                )}
                <Button title="Go Back" onclick={() => {this.props.navigation.goBack()}} disabled={this.props.loading} />
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#eee' },
    btnGroup: { flexDirection: 'row' },
    input: {borderWidth:1, marginBottom: 4, marginTop:0, padding: 2},
    inputLabel: {fontWeight: 'bold'},
});

export default connect(
    state => ({
        data: { ...state.form },
        loading: state.form.loading && state.countries.loaded,
        countries: state.countries.data,
    }),
    (dispatch, props) => ({
        ...props,
        dispatch
    })
)(FormPage);