import { createStackNavigator } from 'react-navigation';

import HomePage from '../pages/homePage/index';


const Navigation = createStackNavigator({
    Home: { screen: HomePage },
    // WeatherDetail: {
    //     screen: WeatherDetail
    // }
});

export default Navigation;