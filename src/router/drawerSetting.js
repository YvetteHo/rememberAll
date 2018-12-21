import { createStackNavigator,  createAppContainer, createDrawerNavigator  } from 'react-navigation';

import HomePage from '../pages/homePage/index';
import NewNote from '../pages/newNote/index';
import Login from '../pages/login/index';

export const AppStack = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
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


export default createAppContainer(AppStack);