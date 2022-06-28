import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import RootView from './rootView';
import Button from './button';
import LoadingIndicator from './loadingIndicator';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import flagImages from '../images/flags';
import {addItem, editItem} from '../actions/open-form';
import {fetchList} from '../actions/list';

Cell.propTypes.textStyle = PropTypes.oneOfType([ PropTypes.object, PropTypes.arrayOf(PropTypes.object) ]); //Fixes a bug

class TableContent extends Component {
    componentDidMount() {
        this.props.dispatch(fetchList());
    }

    componentDidUpdate() {
        if (this.props.refreshing) {
            this.props.dispatch(fetchList());
        }
    }

    render() {
        const { data, contentFn, css, flexArr } = this.props
        let colNames = ['Name', 'Age', 'Gender', 'CtrCode', 'Id']
        return (
            <Table borderStyle={styles.tableBorder}>
            {
                data.map((rowData, index) => (
                    <TableWrapper key={index} flexArr={flexArr} style={styles.row}>
                    {
                        colNames.map((col, cellIndex) => (
                            <Cell key={cellIndex} data={contentFn[cellIndex](rowData[col])} textStyle={css[cellIndex]} style={{flex: flexArr[cellIndex]}}/>
                        ))
                    }
                    </TableWrapper>
                ))
            }
            </Table>
        );
    }
}

export default class ListPage extends Component {
    constructor(props) {
        super(props);

        const mapDispatchToProps = (dispatch, props) => ({
            onclick: () => {
                this._editData(props.id, dispatch);
            },
            dispatch
        });

        const AddButton = connect(
            () => ({
                title: 'Add Person',
                style: {alignSelf: 'flex-end', marginRight: 0}
            }),
            mapDispatchToProps
        )(Button);

        const EditButton = connect(null, mapDispatchToProps)(props => (
            <TouchableOpacity onPress={props.onclick} style={styles.buttonEdit}>
                <Image source={require('../images/edit.png')} style={styles.image} />
            </TouchableOpacity>
        ));
        
        const flag = code => <Image source={flagImages[code]} style={styles.image} />;
        const editBtn = id => <EditButton id={id} />;
        const text = s => s;
        
        let textCenterStyle = Object.assign({}, styles.text, styles.textCenter);
        let css = [
            styles.text, //Name
            textCenterStyle, //Age
            textCenterStyle, //Gender
            null, //Ctry (flag)
            null, //edit button
        ];
        let contentFn = [text, text, text, flag, editBtn];
        let flexArr = [3, 1, 1, 1, 1];
        const ListContent = connect(
            state => ({
                data: state.list.data,
                refreshing: state.list.refreshing,
                contentFn,
                flexArr,
                css,
            }),
            mapDispatchToProps
        )(TableContent);

        const Indicator = connect(
            state => ({loading: state.list.loading})
        )(LoadingIndicator);

        this.render = () => (
            <RootView style={styles.container}>
                <AddButton />
                <Table borderStyle={styles.tableBorder}>
                    <Row
                        data={['Name', 'Age', 'Gndr', 'Ctry', ' ']}
                        flexArr={flexArr}
                        style={styles.head}
                        textStyle={{...textCenterStyle, ...styles.textBold}}
                    />
                </Table>
                <View style={styles.content}>
                    <ScrollView style={styles.content}>
                        <ListContent />
                    </ScrollView>
                    <Indicator size="large" />
                </View>
            </RootView>
        );
    }

    _editData(id, dispatch) {
        let navigate = this.props.navigation.navigate;
        if (id) {
            dispatch(editItem(id));
            navigate('Edit');
        }
        else {
            dispatch(addItem());
            navigate('Add');
        }
    }
}

const styles = StyleSheet.create({
    container: {padding: 16, backgroundColor: '#eee'},
    head: {height: 40, backgroundColor: '#ccc'},
    content: {flex: 1},
    tableBorder: {borderColor: 'transparent'},
    text: {fontSize: 14, margin: 6},
    textCenter: {textAlign: 'center'},
    textBold: {fontWeight: 'bold'},
    cellCenter: {alignItems: 'center'},
    row: {flexDirection: 'row'},
    image: {alignSelf: 'center', height: 14, resizeMode: 'contain'},
    buttonEdit: {alignSelf: 'center'},
});