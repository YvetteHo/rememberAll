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
    Platform,
    Image,
    cameraRoll,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Header from "../../components/header";
import AudioOperation from "../../components/audioOperation";
import {AudioUtils} from 'react-native-audio';
import AudioPlayer from "../../components/audioPlayer";
import ImagePicker from 'react-native-image-picker';
import MyVideoPlayer from "../../components/videoPlayer";
import {WhiteSpace, Card, Modal, SwipeAction, TextareaItem} from 'antd-mobile-rn';
import {
    updateNote,
    deleteAudio,
    cancelTrans,
    commitTrans, deletePicture, insertPicture, deleteVideo,
} from "../../database/schemas";
import Sound from "react-native-sound";
import FullWidthImage from "../../components/FullWidthImage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spacer from 'react-native-spacer';
const Spinner = require('react-native-spinkit');

const uuid = require('uuid/v1');
const demessions = Dimensions.get('window');

const options = {
    title: 'Select picture',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        noData: true
    },
};

export default class NewNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: {
                start: 0,
                end: 0
            },
            recording: false,
            change: false,
            modalVisible: true,
            note: props.navigation.getParam('note'),
            noteContent: Array.from(props.navigation.getParam('note').noteContent),
            newValue: '',
            height: 40,
            value: '',
            isLoading: false,
            newPicture: '',
            isVideoRecording: false,
        };
        this.endRecording = this.endRecording.bind(this);
    }

    onChangeText = (newValue) => {
        this.setState({newValue: newValue, change: true})
    };

    componentDidMount() {
    }
    handleSelectionChange = ({ nativeEvent: { selection } }) => {
        console.log(selection)
        this.setState({ selection })
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

    endVideoRecording = (uri) => {
        console.warn('回来了', uri);
        const oldNoteContent = this.state.noteContent;
        oldNoteContent.push(uri);
        this.setState({
            noteContent: oldNoteContent,
            change: true
        })
    };

    cameraClicked = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                 // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    newPicture: {uri: response.uri},
                });
                const oldNoteContent = this.state.noteContent;
                oldNoteContent.push('*#image#*' + response.uri);
                this.setState({
                    noteContent: oldNoteContent,
                    change: true
                });
                insertPicture({uri: '*#image#*' + response.uri, noteId: this.state.note.id})
            }

        });
    };
    videoCamClicked = () => {
        this.props.navigation.navigate('VideoOperation', {
            noteId: this.state.note.id,
            endVideoRecording: this.endVideoRecording
        });
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
            oldNoteContent.splice(index, 1);
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
        cancelTrans().then(() => {
            console.log('cancelTrans');
            this.props.navigation.goBack()
        });
    };

    save = (name) => {
        const note = this.props.navigation.getParam('note', null);

        console.log(`name: ${name}`);
        this.setState({
            isLoading: true
        });
        updateNote({
            id: note.id,
            name: name || note.name,
            noteType: note.noteType,
            time: note.time,
            noteContent: this.state.noteContent
        }).then(() => {
            commitTrans().then(() => {
                this.setState({
                    isLoading: false
                });
                this.props.navigation.goBack()
            }).catch(() => {
                this.setState({
                    isLoading: false
                });
            });

        }).catch(() => {
            cancelTrans().then(() => {
                this.setState({
                    isLoading: false
                });
            });
        });
    };

    cancel = () => {
        this.setState({
            isLoading: true
        });
        cancelTrans().then(() => {
            this.setState({
                isLoading: false
            });
            this.props.navigation.goBack()
        });

    };

    clickSave = () => {

        const isNew = this.props.navigation.getParam('isNew', null);

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
                        onPress: this.cancel,
                        style: 'cancel',
                    },
                    {
                        text: '保存',
                        onPress: name => this.save(name)
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
                    onPress: this.cancel,
                    style: 'cancel',
                },
                {
                    text: '保存',
                    onPress: this.save
                }]
            );
        }

    };

    renderAudio = (element, index) => {
        const swipeOutButtons = [
            {
                text: '删除',
                onPress: () => {
                    deleteAudio(element).then(() => {
                        const oldNoteContent = this.state.noteContent;
                        const index = oldNoteContent.indexOf(element);
                        if (index > -1) {
                            oldNoteContent.splice(index, 1);
                        }
                        this.setState({
                            noteContent: oldNoteContent,
                            change: true
                        })
                    }).catch(() => {

                    })
                },
                style: {color: 'white'}
            }
        ];

        return (
            <SwipeAction right={swipeOutButtons} key={index}>
                <AudioPlayer id={index}/>
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
                // ref={ref => this.textInput = ref}
                key={index}
                placeholder="Your Placeholder"
                onChangeText={(text) => {
                    this.state.noteContent[index] = text;
                    this.setState({
                        change: true
                    })
                }}
                style={styles.textInputStyle}
                editable
                multiline
                defaultValue={element}
                onContentSizeChange={(e) => {
                    // this.measureTextInput()
                    this.updateSize(e.nativeEvent.contentSize.height)
                }}
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

                        } else if (element.slice(0, 9) === '*#image#*') {
                            const swipeOutButtons = [
                                {
                                    text: '删除',
                                    onPress: () => {
                                        deletePicture(element).then(() => {
                                            const oldNoteContent = this.state.noteContent;
                                            const index = oldNoteContent.indexOf(element);
                                            if (index > -1) {
                                                oldNoteContent.splice(index, 1);
                                            }
                                            this.setState({
                                                noteContent: oldNoteContent,
                                                change: true
                                            })
                                        }).catch(() => {

                                        })
                                    },
                                    style: {color: 'white'}
                                }
                            ];

                            return <SwipeAction right={swipeOutButtons} key={index}>
                                <FullWidthImage uri={element.substr(9)} key={index}/>
                            </SwipeAction>
                        }else if (element.slice(0, 9) === '*#video#*'){
                            const swipeOutButtons = [
                                {
                                    text: '删除',
                                    onPress: () => {
                                        deleteVideo(element).then(() => {
                                            const oldNoteContent = this.state.noteContent;
                                            const index = oldNoteContent.indexOf(element);
                                            if (index > -1) {
                                                oldNoteContent.splice(index, 1);
                                            }
                                            this.setState({
                                                noteContent: oldNoteContent,
                                                change: true
                                            });

                                            console.warn(element)
                                        }).catch((res) => {
                                            console.warn(res)
                                        })
                                    },
                                    style: {color: 'white'}
                                }
                            ];
                            // return <Video key={index} source={{uri: element.slice(9)}} style={styles.backgroundVideo}/>
                            return <SwipeAction right={swipeOutButtons} key={index}>
                            <MyVideoPlayer key={index} uri={element.slice(9)}/>
                            </SwipeAction>;
                            // return <Text>{element}喵喵喵</Text>
                        }else {
                                return this.renderTextInput(element, index)
                        }
                    }
                )}
            </View>
        )

    };
    measureTextInput() {
        this.textInput.measure((x, y, width, height, pageX, pageY) => {
            console.log(x, y, width, height, pageX, pageY)
            console.log(y + height)

            this.scrollView.scrollToPosition(x, y + height - 300, true)
            // this.scrollView.scrollTo()
        })
    }


    updateSize = (height) => {
        this.setState({
            height
        });
    };

    render() {
        const { selection } = this.state;
        const {navigation} = this.props;
        const note = navigation.getParam('note', null);
        const {newValue, height} = this.state;
        let newStyle = {
            height,
            fontSize: 50,
        };
        return (

            <View style={styles.container}>
                {this.state.isLoading ? <View style={styles.transparentMaskView}/> : <View/>}
                {this.state.isLoading ?
                    <View style={styles.floatView}>
                        <Spinner style={styles.spinner} isVisible={true} size={100} type='Circle' color='#FF5722'/>
                    </View> : <View/>}

                {this.state.recording ? <View style={styles.maskView}>
                </View> : <View/>}
                {this.state.recording ? <View style={styles.floatView}>
                    <AudioOperation endRecording={(e) => this.endRecording(e)} note={note ? note : null}/>
                </View> : <View/>}
                {/*{this.state.isVideoRecording ? <View style={styles.floatView}>*/}
                {/*    <VideoOperation style={{width: '100%', height: '100%'}}/>*/}
                {/*</View> : <View/>}*/}
                <SafeAreaView style={styles.container}>
                    <Header leftElement={
                        this.state.change ? <TouchableOpacity
                                onPress={this.clickSave}
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
                            <KeyboardAwareScrollView
                                // ref={ref => this.scrollView = ref}
                                // style={{flex:1}}
                                // onContentSizeChange={(contentWidth, contentHeight) => {
                                //     console.log('changeSize');
                                //     this.scrollView.scrollToEnd({animated: true})
                                // }}
                            >
                                {this.showContent()}
                                <TextInput
                                    ref={ref => this.textInput = ref}
                                    onChangeText={this.onChangeText}
                                    selection={selection}
                                    onSelectionChange={this.handleSelectionChange}
                                    style={styles.textInputStyle}
                                    editable
                                    multiline
                                    value={newValue}
                                    onContentSizeChange={(e) => {
                                        // this.measureTextInput()
                                        this.updateSize(e.nativeEvent.contentSize.height)

                                    }}
                                    keyboardType="default"
                                />

                            </KeyboardAwareScrollView>
                        <View style={styles.footerContainer}>
                            <View style={styles.footerLeft}>
                                <TouchableOpacity onPress={this.cameraClicked}>
                                    <Icon name="camera" size={64} color="#FF5722"/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footerCenter}>
                                <TouchableOpacity onPress={this.micClicked}>
                                    <Icon name="mic" size={64} color="#FF5722"/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footerRight}>
                                <TouchableOpacity onPress={this.videoCamClicked}>
                                    <Icon name="videocam" size={64} color="#FF5722"/>
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
    transparentMaskView: {
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
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    // footerContainer: {
    //     position: 'absolute',
    //     left: 0,
    //     // right: 0,
    //     bottom: 0,
    //     justifyContent: 'center',
    //     flexDirection: 'row',
    // },
    // footerCenter: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     flex: 1,
    // },
    // footerLeft: {
    //     marginLeft: 5,
    //     flex: 1,
    // },
    // footerRight: {
    //     marginRight: 5,
    //     flex: 1,
    // },
    footerContainer: {
        // flex: 1,
        // position: 'absolute',
        // bottom: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    footerCenter: {
        alignItems: 'center',
        flex: 1,
    },
    footerLeft: {
        // marginLeft: 5,
        flex: 1,
    },
    footerRight: {
        // marginRight: 5,
        alignItems: 'flex-end',
        flex: 1,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,

    },
    textInputStyle: {
        fontSize: 20,
    },
    canvasContainer: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
        position: 'relative'
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});