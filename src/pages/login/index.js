import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, List, WhiteSpace} from 'antd-mobile-rn';
import {NavigationActions, StackActions} from "react-navigation";
import Header from '../../components/header';
import Icon from "react-native-vector-icons/dist/MaterialIcons";


const icon = <Icon name="list" size={45} color="#FF5722"/>;
export default class Login extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }



    render() {

        return (
            <SafeAreaView>
                <View>
                    <Header leftElement={icon} titleElement='登陆'/>
                    <Button
                        onClick={() => {
                            console.log(this.props);
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({routeName: 'Drawer'})
                                ],
                            }))
                        }}
                    >登陆咕咕咕</Button>
                </View>
            </SafeAreaView>

        );
    }
}