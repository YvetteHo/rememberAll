import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, List, WhiteSpace } from 'antd-mobile-rn';
import {NavigationActions, StackActions} from "react-navigation";


export default class Login extends React.Component<any, any> {

    render() {
        return (
            <View>
                <Button
                    onClick={() => {
                        console.log(this.props);
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Drawer' })
                            ],
                        }))
                    }}
                >登陆</Button>

            </View>

        );
    }
}