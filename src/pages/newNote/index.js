import React from 'react';
import { Animated, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {Drawer, Button, WhiteSpace} from 'antd-mobile-rn';
import { StackActions, NavigationActions } from 'react-navigation';

export default class NewNote extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1}}>

                <View style={{height: 45}} >
                    <TouchableOpacity
                        onPress={() => this.drawer && this.drawer.openDrawer()}
                        style={{width: 45, marginLeft: 10}}
                    >

                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <Text style={{fontSize: 100}}>咕咕咕咕咕咕</Text>

                </ScrollView>



            </View>
        );
    }
}
