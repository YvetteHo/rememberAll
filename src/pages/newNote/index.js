import React from 'react';
import { SafeAreaView, Animated, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {Drawer, Button, WhiteSpace} from 'antd-mobile-rn';
import { StackActions, NavigationActions } from 'react-navigation';
import Header from "../../components/header";

const { width, height } = Dimensions.get('window');

export default class NewNote extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SafeAreaView>
                <View style={{flex: 1}}>
                    <Header leftElement={
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{width: 45, marginLeft: 10}}>
                            <Icon name="keyboard-arrow-left" size={45} color="#FF5722"/>
                        </TouchableOpacity>}/>
                    <ScrollView>
                        <Text style={{fontSize: 100}}>咕咕咕咕咕咕</Text>

                    </ScrollView>

                </View>
            </SafeAreaView>
        );
    }
}
