import React from 'react';
import { Animated, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {Drawer, Button, WhiteSpace} from 'antd-mobile-rn';
import { StackActions, NavigationActions } from 'react-navigation';

let navigation = null;
export default class NewNote extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <Button
                    onClick={() => this.props.navigation.goBack()}
                >回去</Button>

                <ScrollView>
                    <Text style={{fontSize: 100}}>咕咕咕咕咕咕</Text>

                </ScrollView>



            </View>
        );
    }
}
