import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Button from './button';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import flagImages from '../images/flags';
import { addItem, editItem } from '../actions/open-form';
import { fetchList } from '../actions/list';


const Indicator = connect((state, props) => {
    let color = props.color || 'blue';
    let style = props.style || {};
    style.display = state.list.loading ? 'flex' : 'none';
    return { ...props, color, style };
})(ActivityIndicator);

class TableContent extends Component {
    componentDidMount() {
        if (this.props.loading) this.props.dispatch(fetchList());
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.loading && this.props.loading) this.props.dispatch(fetchList());
    }

    render() {
        const { data, contentFn, css, flexArr } = this.props
        let colNames = ['Name', 'Age', 'Sex', 'CtrCode', 'Id']
        return (
            <Table borderStyle={{borderColor: 'transparent'}}>
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
    _lastRefreshTime = new Date().getTime();

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

    render() {
        const mapDispatchToProps = (dispatch, props) => {
            let This = this;
            return {
                onclick: () => {
                    This._editData(props.id, dispatch);
                },
                dispatch
            };
        };

        const AddButton = connect(
            () => { return {title:'Add Person', style:{alignSelf:'flex-end', marginRight:0, width:'50%'}} },
            mapDispatchToProps
        )(Button);

        const EditButton = connect(null, mapDispatchToProps)(props => (
            <TouchableOpacity onPress={props.onclick} style={{alignSelf:'center'}}>
                <Image source={require('../images/edit.png')} style={styles.image} />
            </TouchableOpacity>
        ));
        
        const flag = code => <Image source={flagImages[code]} style={styles.image} />;
        const editBtn = id => <EditButton id={id} />;
        const text = s => s;
        
        let css = [
            styles.text, //Name
            [styles.text, styles.textCenter], //Age
            [styles.text, styles.textCenter], //Sex
            null, //Cty (flag)
            null, //edit button
        ];
        let contentFn = [text, text, text, flag, editBtn];
        let flexArr = [3, 1, 1, 1, 1];
        const ListContent = connect(
            state => {
                return {
                    data: state.list.data,
                    loading: state.list.loading,
                    contentFn,
                    flexArr,
                    css
                };
            },
            mapDispatchToProps
        )(TableContent);

        return (
            <View style={styles.container}>
                <AddButton />
                <Table borderStyle={{borderColor: 'transparent'}}>
                    <Row data={['Name', 'Age', 'Sex', 'Cty', ' ']} flexArr={flexArr} style={styles.head} textStyle={styles.text}/>
                </Table>
                <ScrollView>
                    <Indicator size="large" />
                    <ListContent />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#eee' },
    head: { height: 40, backgroundColor: '#ccc' },
    text: { margin: 6 },
    textCenter: { textAlign: 'center'},
    cellCenter: { alignItems: 'center'},
    row: { flexDirection: 'row' },
    image: { alignSelf: 'center', width: 16, resizeMode: 'contain' }
});