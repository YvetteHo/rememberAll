// Main Screens for Drawer Navigator
import { createStackNavigator,  createAppContainer, createDrawerNavigator  } from 'react-navigation';

import HomePage from '../pages/homePage/index';
import NewNote from '../pages/newNote/index';
import Login from '../pages/login/index';
import VideoOperation from '../pages/videoOperation/index'
import SearchPage from '../pages/searchPage/index'
import MyCalendar from  '../pages/calendar/index'

const DrawerNavigator = createStackNavigator({
    Home: {
        screen: HomePage,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
    SearchPage: {
        screen: SearchPage,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
    MyCalendar: {
        screen: MyCalendar,
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
    },
    VideoOperation: {
        screen: VideoOperation,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    }
}, {
    initialRouteName: 'Home',
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