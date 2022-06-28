import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ListPage from './ui/list';
import FormPage from './ui/form';

const createScreen = (ScreenComponent, title) => ({
    screen: ScreenComponent,
    navigationOptions: {
        title,
        headerStyle: {backgroundColor: '#f05555'},
        headerTintColor: '#ffffff',
    },
}); 
const App = createStackNavigator({
    List: createScreen(ListPage, 'List of People'),
    Add:  createScreen(FormPage, 'Add New Person'),
    Edit: createScreen(FormPage, 'Edit Data of Person'),
});
export default createAppContainer(App);