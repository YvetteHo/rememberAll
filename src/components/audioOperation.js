import React from 'react';
import {
    SafeAreaView,
    Animated,
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    AppRegistry,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
} from 'react-native';

import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import {insertAudio, updateNote} from "../database/schemas";
const uuid = require('uuid/v1');
const { width, height } = Dimensions.get('window');

async function requestAudioPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: '请求访问麦克风',
                message:
                    '打开您的麦克风' +
                    '以便录音',
                buttonNeutral: '稍后再问',
                buttonNegative: '取消',
                buttonPositive: '好的',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('您可以使用麦克风了');
        } else {
            console.log('拒绝使用');
        }
    } catch (err) {
        console.warn(err);
    }
}

export default class AudioOperation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            currentTime: 0.0,
            paused: false,
            stoppedRecording: false,
            finished: false,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
            hasPermission: undefined,
        };
    }

    prepareRecordingPath = (audioPath) => {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    };

    micClicked = () => {
        if (!this.state.recording) {
            this._record();
        }
        if (this.state.recording) {
            this._stop();
        }

    };

    pauseClicked = () => {
        if (this.state.recording && this.state.paused) {
            this._resume();
        }
        if (this.state.recording && !this.state.paused) {
            this._pause();
        }
    };

    _renderButton = (title, onPress, active) => {
        const style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    };

    _renderPauseButton = (onPress, active) => {
        const style = (active) ? styles.activeButtonText : styles.buttonText;
        const title = this.state.paused ? "RESUME" : "PAUSE";
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    };

    async _pause() {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({paused: true});
        } catch (error) {
            console.error(error);
        }
    }

    async _resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }
        try {
            await AudioRecorder.resumeRecording();
            this.setState({paused: false});
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _play() {
        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            let sound = new Sound(this.state.audioPath, '', (error) => {
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

    async _record() {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if(this.state.stoppedRecording){
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true, paused: false});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _finishRecording(didSucceed, filePath, fileSize) {

        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    componentDidMount() {
        if(Platform.OS === 'android') {
            requestAudioPermission().then(
            );
        }

        AudioRecorder.checkAuthorizationStatus().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });
            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
                const id = '*#audio#*' + uuid();
                insertAudio({uuid: id, noteId: this.props.note.id || ''});

                this.endRecording(id);
            };
        });
    }
    endRecording = (id) => {
        this.props.endRecording(id);
        console.log('end')
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                    <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                    <View style={{flex: 1}}/>
                    <View style={styles.footerContainer}>
                        <View style={styles.footerLeft}/>
                        <View style={styles.footerCenter}>
                            <TouchableOpacity onPress={this.micClicked}>
                                {this.state.recording ?
                                    <Icon name="stop" size={64} color="#FF5722"/> :
                                    <Icon name="fiber-manual-record" size={64} color="#FF5722"/>
                                }
                            </TouchableOpacity>
                        </View>
                        {this.state.recording ? <View style={styles.footerRight}>
                            <TouchableOpacity onPress={this.pauseClicked}>
                                {this.state.recording && this.state.paused?
                                    <Icon name="play-arrow" size={64} color="#FF5722"/> :
                                    <Icon name="pause" size={64} color="#FF5722"/>
                                }
                            </TouchableOpacity>
                        </View> : <View style={styles.footerRight}/>}
                    </View>
            </SafeAreaView>


        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        alignItems: 'center',
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    },
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
    }

});
