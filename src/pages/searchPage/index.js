/* eslint-disable no-console */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Slider,
    TouchableWithoutFeedback,
    Dimensions,
    SafeAreaView,
    CameraRoll,
} from 'react-native';
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import Header from "../../components/header";
import {cancelTrans} from "../../database/schemas";


const { width, height } = Dimensions.get('window');


export default class SearchPage extends React.Component {

    goBack = () => {
        this.props.navigation.goBack()
    };
    render() {
        return <SafeAreaView style={styles.container}>
            <Header leftElement={
            <TouchableOpacity
                    onPress={this.goBack}
                    style={{width: 45, marginLeft: 10}}>
                    <Icon name="keyboard-arrow-left" size={45} color="#FF5722"/>
                </TouchableOpacity>
        } titleElement='检索'/></SafeAreaView>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
