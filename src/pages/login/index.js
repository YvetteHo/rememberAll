import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Platform} from 'react-native';
import {Button, List, WhiteSpace} from 'antd-mobile-rn';
import {NavigationActions, StackActions} from "react-navigation";
import Header from '../../components/header';
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import Frisbee from 'frisbee';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import CodeInput from 'react-native-confirmation-code-input';

const api = new Frisbee({
    baseURI: 'http://localhost:3000',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;
const brandColor = '#FF5722';
const icon = <Icon name="list" size={45} color="#FF5722"/>;
export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            enterCode: false,
            spinner: false,
            country: {
                cca2: 'CN',
                callingCode: '86'
            }
        };
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Drawer'})
            ],
        }))
    }
    _getCode = () => {
        setTimeout(() => {
            Alert.alert('发送成功!', "验证码已经发送到您的手机", [{
                text: 'OK',
                // onPress: () => this.refs.form.refs.textInput.focus()
            }]);
        }, 100);

        this.setState({
            spinner: false,
            enterCode: true,
            // verification: res.body
        });

        // this.setState({ spinner: true });

        // setTimeout(async () => {
        //
        //     try {
        //
        //         const res = await api.post('/v1/verifications', {
        //             body: {
        //                 ...this.refs.form.getValues(),
        //                 ...this.state.country
        //             }
        //         });
        //
        //         if (res.err) throw res.err;
        //
        //         this.setState({
        //             spinner: false,
        //             enterCode: true,
        //             verification: res.body
        //         });
                this.refs.form.refs.textInput.setNativeProps({ text: '' });
        //
        //         setTimeout(() => {
        //             Alert.alert('Sent!', "We've sent you a verification code", [{
        //                 text: 'OK',
        //                 onPress: () => this.refs.form.refs.textInput.focus()
        //             }]);
        //         }, 100);
        //
        //     } catch (err) {
        //         // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        //         this.setState({ spinner: false });
        //         setTimeout(() => {
        //             Alert.alert('Oops!', err.message);
        //         }, 100);
        //     }
        //
        // }, 100);

    }

    _verifyCode = () => {

        // this.setState({ spinner: true });

        setTimeout(async () => {
            setTimeout(() => {
                Alert.alert('Success!', 'You have successfully verified your phone number');
            }, 100);
            this.props.navigation.dispatch(StackActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({routeName: 'Drawer'})
                                            ],
                                        }))
        }, 100)

        //     try {
        //
        //         const res = await api.put('/v1/verifications', {
        //             body: {
        //                 ...this.refs.form.getValues(),
        //                 ...this.state.country
        //             }
        //         });
        //
        //         if (res.err) throw res.err;
        //
        //         this.refs.form.refs.textInput.blur();
        //         // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        //         this.setState({ spinner: false });
        //         setTimeout(() => {
        //             Alert.alert('Success!', 'You have successfully verified your phone number');
        //         }, 100);
        //
        //     } catch (err) {
        //         // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        //         this.setState({ spinner: false });
        //         setTimeout(() => {
        //             Alert.alert('Oops!', err.message);
        //         }, 100);
        //     }
        //
        // }, 100);


    };

    _onChangeText = (val) => {
        if (!this.state.enterCode) return;
        if (val.length === MAX_LENGTH_CODE)
            this._verifyCode();
    }

    _tryAgain = () => {
        this.refs.form.refs.textInput.setNativeProps({ text: '' })
        this.refs.form.refs.textInput.focus();
        this.setState({ enterCode: false });
    }

    _getSubmitAction = () => {
        this.state.enterCode ? this._verifyCode() : this._getCode();
    }

    _changeCountry = (country) => {
        this.setState({ country });
        this.refs.form.refs.textInput.focus();
    }

    _renderFooter = () => {

        if (this.state.enterCode)
            return (
                <View>
                    <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
                        Enter the wrong number or need a new code?
                    </Text>
                </View>
            );

        return (
            <View>
                <Text style={styles.disclaimerText}>点击上方按钮，发送验证码到手机以验证您的身份</Text>
            </View>
        );

    }

    _renderCountryPicker = () => {

        if (this.state.enterCode)
            return (
                <View />
            );

        return (
            <CountryPicker
                ref={'countryPicker'}
                closeable
                style={styles.countryPicker}
                onChange={this._changeCountry}
                cca2={this.state.country.cca2}
                // styles={countryPickerCustomStyles}
                translation='eng'/>
        );

    }

    _renderCallingCode = () => {

        if (this.state.enterCode)
            return (
                <View />
            );

        return (
            <View style={styles.callingCodeView}>
                <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
            </View>
        );

    }

    _onFulfill = () => {
        this._verifyCode();
    }

    render() {

        return(
            <View></View>
        )
        // let headerText = `你的 ${this.state.enterCode ? '验证码' : '电话号码'} 是什么?`
        // let buttonText = this.state.enterCode ? '进行验证' : '发送验证码';
        // let textStyle = this.state.enterCode ? {
        //     height: 50,
        //     textAlign: 'center',
        //     fontSize: 40,
        //     fontWeight: 'bold',
        //     fontFamily: 'Courier'
        // } : {};
        //
        // return (
        //
        //     <View style={styles.container}>
        //
        //         <Text style={styles.header}>{headerText}</Text>
        //
        //         <Form ref={'form'} style={styles.form}>
        //
        //             <View style={this.state.enterCode ? { flexDirection: 'row', justifyContent: 'center'} : { flexDirection: 'row'}}>
        //
        //                 {this._renderCountryPicker()}
        //                 {this._renderCallingCode()}
        //                 {this.state.enterCode ? (<View style={{ justifyContent: 'center', height: 45}}><CodeInput
        //                     ref="codeInputRef1"
        //                     activeColor='#FF5722'
        //                     inactiveColor='#9e9e9e'
        //                     // secureTextEntry
        //                     className={'border-b'}
        //                     space={6}
        //                     size={30}
        //                     inputPosition='left'
        //                     keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        //                     onFulfill={(code) => this._onFulfill(code)}/></View>):<TextInput
        //                     ref={'textInput'}
        //                     name={this.state.enterCode ? 'code' : 'phoneNumber' }
        //                     type={'TextInput'}
        //                     underlineColorAndroid={'transparent'}
        //                     autoCapitalize={'none'}
        //                     autoCorrect={false}
        //                     onChangeText={this._onChangeText}
        //                     placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
        //                     keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        //                     style={[ styles.textInput, textStyle ]}
        //                     returnKeyType='go'
        //                     autoFocus
        //                     placeholderTextColor={brandColor}
        //                     selectionColor={brandColor}
        //                     maxLength={this.state.enterCode ? 6 : 20}
        //                     onSubmitEditing={this._getSubmitAction} />}
        //
        //
        //
        //             </View>
        //
        //             <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
        //                 <Text style={styles.buttonText}>{ buttonText }</Text>
        //             </TouchableOpacity>
        //
        //             {this._renderFooter()}
        //
        //         </Form>
        //
        //         <Spinner
        //             visible={this.state.spinner}
        //             textContent={'One moment...'}
        //             textStyle={{ color: '#fff' }} />
        //
        //     </View>

        // );
    }



    // render() {
    //
    //     return (
    //         <SafeAreaView>
    //             <View>
    //                 <Header leftElement={icon} titleElement='登陆'/>
    //                 <Button
    //                     onClick={() => {
    //                         console.log(this.props);
    //                         this.props.navigation.dispatch(StackActions.reset({
    //                             index: 0,
    //                             actions: [
    //                                 NavigationActions.navigate({routeName: 'Drawer'})
    //                             ],
    //                         }))
    //                     }}
    //                 >登陆咕咕咕</Button>
    //             </View>
    //         </SafeAreaView>
    //
    //     );
    // }
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