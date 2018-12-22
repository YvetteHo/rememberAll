// Main Screens for Drawer Navigator
import { createStackNavigator,  createAppContainer, createDrawerNavigator  } from 'react-navigation';

import HomePage from '../pages/homePage/index';
import NewNote from '../pages/newNote/index';
import Login from '../pages/login/index';

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomePage,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
    NewNote: {
        screen: NewNote,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    }
});

export const AppRouter = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
    Drawer: {
        screen: DrawerNavigator,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    }
});


export default createAppContainer(AppRouter);