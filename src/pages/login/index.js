import React from 'react';
import {Fragment} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Platform} from 'react-native';
import {Button, List, WhiteSpace} from 'antd-mobile-rn';
import {NavigationActions, StackActions} from "react-navigation";
import Header from '../../components/header';
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import {postData} from '../../components/http';

const brandColor = '#FF5722';
const icon = <Icon name="list" size={45} color="#FF5722"/>;
export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
        };
        // this.props.navigation.dispatch(StackActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({routeName: 'Drawer'})
        //     ],
        // }))
    }

    login = () => {

        postData('http://127.0.0.1:8000/users/', {
            "id": '771dbc34-7335-11e9-8e7a-acde48001122',
            "name": this.state.userName,
            "password": this.state.password,
        }).then((response) => {
            if (response.status === 200) {
                // console.log(response._bodyText)
                response.json().then((response) => {
                    console.log(response)
                    if (response === "success") {
                        console.log('成功登陆');
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({routeName: 'Drawer'})
                            ],
                        }))
                    }
                    if (response === "fail"){
                        console.log('登陆失败')
                    }
                })

            }
        }).catch((error) => {
            console.log(error)
        })

    };

    render() {

        return (
            <Fragment>
            <SafeAreaView style={{ flex:0, backgroundColor: 'white' }} />
            <SafeAreaView style={{backgroundColor: '#FF5722', height: '100%'}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Header leftElement={icon} titleElement='登陆'/>
                    <TextInput
                        style={{width: '90%', height: 50, borderColor: '#FF5722', borderWidth: 0.5, borderRadius: 5,
                            backgroundColor: 'white', marginBottom: 20, marginTop: 100, fontSize: 20}}
                        placeholder='用户名'
                        onChangeText={(text) => {
                            this.setState({
                                userName: text
                            })

                        }}
                    />
                    <TextInput
                        style={{width: '90%', height: 50, borderColor: '#f5f5f5', borderWidth: 0.5, borderRadius: 5,
                            backgroundColor: 'white', fontSize: 20, marginBottom: 20}}
                        placeholder='密码'
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            })

                        }}
                    />
                    <Button
                        style={{width: '90%'}}
                        onClick={this.login}
                    >登陆咕咕咕</Button>
                </View>
            </SafeAreaView>
            </Fragment>


        );
    }
}

const styles = StyleSheet.create({
    countryPicker: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1
    },
    header: {
        textAlign: 'center',
        marginTop: 60,
        fontSize: 22,
        margin: 20,
        color: '#4A4A4A',
    },
    form: {
        margin: 20
    },
    textInput: {
        padding: 0,
        margin: 0,
        flex: 1,
        fontSize: 20,
        color: brandColor
    },
    button: {
        marginTop: 20,
        height: 50,
        backgroundColor: brandColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Helvetica',
        fontSize: 16,
        fontWeight: 'bold'
    },
    wrongNumberText: {
        margin: 10,
        fontSize: 14,
        textAlign: 'center'
    },
    disclaimerText: {
        marginTop: 30,
        fontSize: 12,
        color: 'grey'
    },
    callingCodeView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    callingCodeText: {
        fontSize: 20,
        color: brandColor,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        paddingRight: 10
    }
});