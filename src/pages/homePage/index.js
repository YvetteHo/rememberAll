import React from 'react';
import { Animated, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {Drawer, Button, WhiteSpace} from 'antd-mobile-rn';
import {BoxShadow} from 'react-native-shadow'

const { width, height } = Dimensions.get('window');

const headerShadow = {
    width: width,
    height: 45,
    color:"#000",
    border: 2.5,
    radius: 0,
    opacity: 0.2,
    x: 0,
    y: 1,
};

export default class HomePage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            isAddClicked: false,
            drawerOpen: true,
        }
    }

    addClicked = () => {
        this.setState({
            isAddClicked: true
        })
    };
    onOpenChange = (isOpen: any) => {
        /* tslint:disable: no-console */
        console.log('是否打开了 Drawer', isOpen.toString());
    };

    render() {
        navigator = this.props.navigation;

        const sidebar = (
            <ScrollView style={{backgroundColor: 'white'}}>
                <Text>你是狗吧</Text>
            </ScrollView>
        );
        return (
            <View style={{flex: 1}}>

                <Drawer sidebar={sidebar} position='left'
                        open={false} drawerRef={el => (this.drawer = el)}
                        onOpenChange={this.onOpenChange}
                        drawerBackgroundColor='#ccc'>
                    <BoxShadow setting={headerShadow}>
                        <View style={{height: 45, width: width, backgroundColor: 'white'}} >
                            <TouchableOpacity
                                onPress={() => this.drawer && this.drawer.openDrawer()}
                                style={{width: 45, marginLeft: 10}}
                            >
                                <Icon name="list" size={45} color="#FF5722" />
                            </TouchableOpacity>
                        </View>
                    </BoxShadow>

                    <ScrollView>
                        <Text style={{fontSize: 100}}>喵喵喵喵喵喵喵喵喵喵喵喵</Text>
                        <Text style={{fontSize: 100}}>汪汪汪汪汪汪汪汪汪汪汪汪</Text>

                    </ScrollView>
                    <View style={{position: 'absolute', left: 0, right: 0, bottom: 6, alignItems: 'center'}}>
                        <Svg
                            height="52"
                            width="52"
                        >
                            <Circle
                                cx="26"
                                cy="26"
                                r="26"
                                fill="white"
                            />
                        </Svg>
                    </View>
                    <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>

                        <TouchableOpacity onPress={this.addClicked} style={styles.button}>
                            <Icon name="add-circle" size={64} color="#FF5722" title="Go to Details"
                                  onPress={() => {this.props.navigation.navigate('NewNote')}}/>
                        </TouchableOpacity>

                    </View>
                </Drawer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        padding: 0,
    },
    countContainer: {
        alignItems: 'center',
        padding: 10
    },
    countText: {
        color: '#FF00FF'
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },

});
