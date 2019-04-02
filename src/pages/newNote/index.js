import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Header from "../../components/header";
import AudioOperation from "../../components/audioOperation";
import {AudioUtils} from 'react-native-audio';

import {WhiteSpace, Card, Modal, SwipeAction, TextareaItem} from 'antd-mobile-rn';
import {
    updateNote,
    deleteAudio,
    rememberAllRealm,
    cancelTrans,
    commitTrans,
} from "../../database/schemas";
import Sound from "react-native-sound";
import debounce from 'lodash/debounce';

const uuid = require('uuid/v1');
const {width, screenHeight} = Dimensions.get('window');

export default class NewNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            change: false,
            modalVisible: true,
            note: props.navigation.getParam('note'),
            noteContent: Array.from(props.navigation.getParam('note').noteContent),
            newValue: '',
            height: 40,
            value: '',
        };
        this.endRecording = this.endRecording.bind(this);
    }

    onChangeText = (newValue) => {
        this.setState({newValue: newValue, change: true})
    };

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


    async _play() {
        if (this.state.recording) {
            await this._stop();
        }

        console.log('play');

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            let sound = new Sound(AudioUtils.DocumentDirectoryPath + '/test.aac', '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    updateText = (index) => {
        const oldNoteContent = this.state.noteContent;
        if (index) {
            oldNoteContent.splice(index,1);
        } else {
            if (this.state.newValue !== '') {
                oldNoteContent.push(this.state.newValue);
                this.setState({
                    newValue: ''
                })
            }
            this.setState({
                noteContent: oldNoteContent
            })
        }


    };


    endRecording(id) {
        console.log('结束了哦');

        const oldNoteContent = this.state.noteContent;
        this.updateText();
        oldNoteContent.push(id);


        this.setState({
            recording: false,
            noteContent: oldNoteContent,
            newValue: ''
        })
    };

    goBack = () => {
        this.props.navigation.goBack()

    };

    save = () => {

        const note = this.props.navigation.getParam('note', null);
        const isNew = this.props.navigation.getParam('isNew', null);

        console.log(this.state.newValue);

        console.log('保存', note);

        console.log(this.state.noteContent);
        if (this.state.newValue.replace(/(\s*$)/g, "") !== "") {
            this.state.noteContent.push(this.state.newValue);
        }

        if (isNew) {
            Modal.prompt(
                '是否保存笔记',
                null,
                [
                    {
                        text: '不保存',
                        onPress: () => {
                            cancelTrans();
                            this.props.navigation.goBack()
                        },
                        style: 'cancel',
                    },
                    {
                        text: '保存',
                        onPress: name => {
                            console.log(`name: ${name}`);
                            updateNote({
                                id: note.id,
                                name: name,
                                noteType: note.noteType,
                                time: note.time,
                                noteContent: this.state.noteContent
                            });
                            console.log('isInTrans', rememberAllRealm.isInTransaction);
                            commitTrans();

                            this.props.navigation.goBack()
                        }
                    }

                ],
                'default',
                '新日志',
                ['请输入日志名']
            );
        } else {
            Modal.alert('是否保存笔记', null, [
                {
                    text: '不保存',
                    onPress: () => {
                        cancelTrans();
                        this.props.navigation.goBack();
                    },
                    style: 'cancel',
                },
                {
                    text: '保存',
                    onPress: () => {
                        updateNote({
                            id: note.id,
                            name: note.name,
                            noteType: note.noteType,
                            time: note.time,
                            noteContent: this.state.noteContent
                        });
                        commitTrans();

                        this.props.navigation.goBack()
                    }
                }]);
        }

    };

    renderAudio = (element, index) => {
        const swipeOutButtons = [
            {
                text: '删除',
                onPress: () => {
                    deleteAudio(element);
                    const oldNoteContent = this.state.noteContent;
                    const index = oldNoteContent.indexOf(element);
                    if (index > -1) {
                        oldNoteContent.splice(index, 1);
                    }
                    this.setState({
                        noteContent: oldNoteContent,
                        change: true
                    });
                },
                style: {color: 'white'}
            }
        ];

        return (
            <SwipeAction right={swipeOutButtons} key={index}>
                <Card full key={index}>
                    <Card.Body>
                        <View style={{height: 42}}>
                            <View style={styles.center}>
                                <TouchableOpacity
                                    onPress={() => this._play()}>
                                    <Icon name="play-arrow" size={32} color="#FF5722"/>
                                </TouchableOpacity>
                            </View>

                            <Text style={{marginLeft: 16}}>{element}</Text>
                        </View>
                    </Card.Body>
                </Card>
            </SwipeAction>
        )
    };

    renderTextInput = (element, index) => {
        const {value, height} = this.state;
        if (element === '') {
            this.updateText(index);
        }

        return (
            <TextInput
                key={index}
                placeholder="Your Placeholder"
                onChangeText={(text) => {
                    console.log(text);
                    this.state.noteContent[index] = text;
                    this.setState({
                        change: true
                    })
                }}
                style={styles.textInputStyle}
                editable
                multiline
                defaultValue={element}
                onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                keyboardType="default"
            />
        )
    };

    showContent = () => {

        return (
            <View>
                {this.state.noteContent.map((element, index) => {
                        if (element.slice(0, 9) === '*#audio#*') {
                            return this.renderAudio(element, index)

                        } else {
                            return this.renderTextInput(element, index)
                        }
                    }
                )}
            </View>
        )

    };


    updateSize = (height) => {
        this.setState({
            height
        });
    };

    render() {
        const {navigation} = this.props;
        const note = navigation.getParam('note', null);
        const {newValue, height} = this.state;

        let newStyle = {
            height,
            fontSize: 50,
        };
        return (

            <View style={styles.container}>
                {this.state.recording ? <View style={styles.maskView}>
                </View> : <View/>}
                {this.state.recording ? <View style={styles.floatView}>
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
                            titleElement={note ? note.name : '新笔记'}
                    />

                    <View style={styles.fullScreen}>
                        <KeyboardAvoidingView
                            style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
                            behavior="padding"
                            enabled={Platform.OS === 'ios'}
                            keyboardVerticalOffset={100}
                        >
                            <ScrollView
                                ref={ref => this.scrollView = ref}
                                onContentSizeChange={(contentWidth, contentHeight) => {
                                    console.log('changeSize');
                                    this.scrollView.scrollToEnd({animated: true})
                                }}
                            >
                                {this.showContent()}
                                <TextInput

                                    onChangeText={ this.onChangeText}
                                    style={styles.textInputStyle}
                                    editable
                                    multiline
                                    value={newValue}
                                    onContentSizeChange={(e) => {
                                        this.updateSize(e.nativeEvent.contentSize.height)

                                    }}
                                    keyboardType="default"
                                />

                            </ScrollView>
                        </KeyboardAvoidingView>
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
        flex: 1,
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
        backgroundColor: 'black',
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

    },
    textInputStyle: {
        height: screenHeight,
        fontSize: 50,
    }
});