import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Header from "../../components/header";
import AudioOperation from "../../components/audioOperation";
import {Modal} from 'antd-mobile-rn';

const {width, height} = Dimensions.get('window');

export default class NewNote extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            // currentTime: 0.0,
            // paused: false,
            // stoppedRecording: false,
            // finished: false,
            // audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
            // hasPermission: undefined,
        }
    }


    micClicked = () => {

        if (this.state.recording) {
            this.stop();
        } else {
        }
        this.setState({
            recording: !this.state.recording
        })

    };

    stop = () => {

    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.maskStyle}>
                    <AudioOperation/>
                </View>
            <SafeAreaView style={styles.container}>
                <Header leftElement={
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{width: 45, marginLeft: 10}}>
                        <Icon name="keyboard-arrow-left" size={45} color="#FF5722"/>
                    </TouchableOpacity>}
                        titleElement='新笔记'
                />

                <View style={styles.fullScreen}>
                    <Text>你是魔鬼吗</Text>
                    <ScrollView>
                        <Text style={{fontSize: 100}}>咕咕咕咕咕咕</Text>
                    </ScrollView>
                    <View style={styles.footerContainer}>
                        <View style={styles.footerCenter}>
                            <TouchableOpacity onPress={this.micClicked}>
                                {this.state.recording ? <Icon name="stop" size={64} color="#FF5722"/>
                                    : <Icon name="mic" size={64} color="#FF5722"/>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
            </View>
        );


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 3,
    },
    fullScreen: {
        flex:1,
    },
    maskStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:'black',
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        zIndex: 4,
    },
    floatView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flex: 1,
    },
    footerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 6,
        justifyContent: 'center',
    },
    footerCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        zIndex: 5
    },
    footerLeft: {
        marginLeft: 5,
        flex: 1,
    },
    footerRight: {
        marginRight: 5,
        flex: 1,
    }
});