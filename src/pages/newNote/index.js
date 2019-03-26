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
import {
    insertNote,
    updateNote,
    deleteNote,
    queryNotes,
    deleteAudio,
    rememberAllRealm,
    beginTrans,
    cancelTrans,
    commitTrans,
} from "../../database/schemas";
import Swipeout from 'react-native-swipeout';
const uuid = require('uuid/v1');
const {width, height} = Dimensions.get('window');

export default class NewNote extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            change: false,
            modalVisible: true,
            note: props.navigation.getParam('note'),
            noteContent: Array.from(props.navigation.getParam('note').noteContent),
        };
        this.endRecording = this.endRecording.bind(this);
    }

    componentDidMount() {

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

    endRecording(id) {
        console.log('结束了哦');

        const oldNoteContent = this.state.noteContent;
        oldNoteContent.push(id);


        this.setState({
            recording: false,
            noteContent: oldNoteContent
        })
    };

    goBack = () => {
        this.props.navigation.goBack()

    };

    save = () => {

        const note = this.props.navigation.getParam('note', null);
        const isNew = this.props.navigation.getParam('isNew', null);

        console.log('保存', note);

        console.log(this.state.noteContent);

        if (isNew) {
            Modal.prompt(
                '保存笔记',
                null,
                name => {
                    console.log(`name: ${name}`);
                    updateNote({
                        id: note.id,
                        name: name,
                        noteType: note.noteType,
                        time: note.time,
                        noteContent: this.state.noteContent
                    }, true);
                    console.log('isInTrans', rememberAllRealm.isInTransaction);
                    commitTrans();
                    this.props.navigation.goBack()
                },
                'default',
                '新日志',
                ['请输入日志名']
            );
        } else {
            updateNote({
                id: note.id,
                name: note.name,
                noteType: note.noteType,
                time: note.time,
                noteContent: this.state.noteContent
            }, true);
            commitTrans();
            this.props.navigation.goBack()
        }

    };


    renderAudio = (element, index) => {
        const swipeoutBtns = [
            {
                text: '删除',
                onPress: () => {
                    deleteAudio(element, true)
                    const oldNoteContent = this.state.noteContent;
                    const index = oldNoteContent.indexOf(element);
                    if (index > -1) {
                        oldNoteContent.splice(index, 1);
                    }
                    this.setState({
                        noteContent: oldNoteContent,
                        change: true
                    });

                }
            }
        ];

        return <Swipeout right={swipeoutBtns} key={index}>
        <Card full key={index}>
            <Card.Body>
                <View style={{ height: 42 }}>
                    <View style={styles.center}>
                        <TouchableOpacity
                            onPress={this.pauseClicked}>
                            <Icon name="play-arrow" size={32} color="#FF5722"/>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ marginLeft: 16 }}>{element}</Text>
                </View>
            </Card.Body>
        </Card>
        </Swipeout>
    };

    showContent = () => {

        return (
            <View>
                {this.state.noteContent.map((element, index) => {
                       return this.renderAudio(element, index)

                    }
                )}
            </View>
        )

    };




    render() {
        const { navigation } = this.props;
        const note = navigation.getParam('note', null);

        const footerButtons = [
            { text: 'Cancel', onPress: () => console.log('cancel') },
            { text: 'Ok', onPress: () => console.log('ok') },
        ];
        return (
            <View style={styles.container}>
                {this.state.recording? <View style={styles.maskView}>
                </View> : <View/>}
                {this.state.recording? <View style={styles.floatView}>
                    <AudioOperation endRecording={(e) => this.endRecording(e)} note={note ? note : null}/>
                </View> : <View/>}
                    <SafeAreaView style={styles.container}>
                        <Header leftElement={
                            this.state.change ? <TouchableOpacity
                                onPress={this.save}
                                style={{width: 45, marginLeft: 10}}>
                                <Icon name="check" size={45} color="#FF5722"/>
                            </TouchableOpacity> :
                                <TouchableOpacity
                                    onPress={this.goBack}
                                style={{width: 45, marginLeft: 10}}>
                                <Icon name="keyboard-arrow-left" size={45} color="#FF5722"/>
                            </TouchableOpacity>

                        }
                                titleElement=  {note ? note.name : '新笔记'}
                        />

                        <View style={styles.fullScreen}>
                            <ScrollView>
                                {this.showContent()}
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
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,

    }
});