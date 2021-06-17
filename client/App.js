import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import ListPage from './ui/list';
import FormPage from './ui/form';

const App = createStackNavigator({
    List: {
        screen: ListPage,
        navigationOptions: {
            title: 'List of People',
            headerStyle: { backgroundColor: '#f05555' },
            headerTintColor: '#ffffff',
        },
    },
    Add: {
        screen: FormPage,
        navigationOptions: {
            title: 'Add New Person',
            headerStyle: { backgroundColor: '#f05555' },
            headerTintColor: '#ffffff',
        },
    },
    Edit: {
        screen: FormPage,
        navigationOptions: {
            title: 'Edit Data of Person',
            headerStyle: { backgroundColor: '#f05555' },
            headerTintColor: '#ffffff',
        },
    },
});
export default createAppContainer(App);