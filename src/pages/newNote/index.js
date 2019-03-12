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
import {WhiteSpace, Card, Modal} from 'antd-mobile-rn';
import {insertNote, updateNote, deleteNote} from "../../database/schemas";
const uuid = require('uuid/v1');
const {width, height} = Dimensions.get('window');

export default class NewNote extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            change: false,
            modalVisible: true,
        };
        this.endRecording = this.endRecording.bind(this);
    }

    micClicked = () => {

        if (this.state.recording) {
            this.stop();
        } else {
        }
        this.setState({
            recording: !this.state.recording,
            change: true
        })

    };

    endRecording(e) {
        console.log('结束了哦')

        this.setState({
            recording: false
        })
    };

    save = () => {
        console.log('保存');
        Modal.prompt(
            '保存笔记',
            null,
            name => {
                console.log(`name: ${name}`);
                insertNote({
                    id: uuid(),
                    name: name,
                    time: new Date(),
                    noteType: '',
                    noteContent: [],
                });
                this.props.navigation.goBack()
            },
            'default',
            '新日志',
            ['请输入日志名']
        );

    };

    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', null);
        console.log('item', JSON.stringify(item));

        const footerButtons = [
            { text: 'Cancel', onPress: () => console.log('cancel') },
            { text: 'Ok', onPress: () => console.log('ok') },
        ];
        return (
            <View style={styles.container}>
                {this.state.recording? <View style={styles.maskView}>
                </View> : <View/>}
                {this.state.recording? <View style={styles.floatView}>
                    <AudioOperation endRecording={(e) => this.endRecording(e)}/>
                </View> : <View/>}
                    <SafeAreaView style={styles.container}>
                        <Header leftElement={
                            this.state.change ? <TouchableOpacity
                                onPress={this.save}
                                style={{width: 45, marginLeft: 10}}>
                                <Icon name="check" size={45} color="#FF5722"/>
                            </TouchableOpacity> :
                                <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                                style={{width: 45, marginLeft: 10}}>
                                <Icon name="keyboard-arrow-left" size={45} color="#FF5722"/>
                            </TouchableOpacity>

                        }
                                titleElement=  {item ? item.name : '新笔记'}
                        />

                        <View style={styles.fullScreen}>
                            <ScrollView>
                                <Text style={{fontSize: 100}}>咕咕咕咕咕咕</Text>
                            </ScrollView>
                            <View style={styles.footerContainer}>
                                <View style={styles.footerCenter}>
                                    <TouchableOpacity onPress={this.micClicked}>
                                            <Icon name="mic" size={64} color="#FF5722"/>
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
    },
    fullScreen: {
        flex:1,
    },
    absolute: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
    },
    maskView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:'black',
        opacity: 0.8,
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
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        zIndex: 4,
    },
    footerContainer: {
        position: 'absolute',
        left: 0,
        // right: 0,
        bottom: 0,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    footerCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
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