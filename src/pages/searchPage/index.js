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
    TextInput,
    ScrollView
} from 'react-native';
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import Header from "../../components/header";
import {deleteAudio, queryAudios, queryImages, queryVideos} from "../../database/schemas";
import {Button, SearchBar, SwipeAction} from 'antd-mobile-rn';
import FontIcon from "react-native-vector-icons/dist/FontAwesome";
import FullWidthImage from "../../components/FullWidthImage";
import MyVideoPlayer from "../../components/videoPlayer";
import AudioPlayer from "../../components/audioPlayer";


const { width, height } = Dimensions.get('window');


export default class SearchPage extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: '计算机',
            type: '',
            audios: [],
            videos: [],
            images: [],
        };
    }
    goBack = () => {
        this.props.navigation.goBack()
    };
    onChange = value => {
        this.setState({ value });
    };
    clear = () => {
        this.setState({ value: '' });
    };
    submit = () => {

    };

    showContent = () => {
        let type = this.state.type;

        // console.log(type, content);
        if (type === 'audio') {
            return  (<View style={{marginTop: 20}}>
                {this.state.audios.map((element, index) => {
                    return <AudioPlayer key={index}/>
                    }
                )}
            </View>)
        } else if (type === 'image') {
            return  (<View style={{marginTop: 20}}>
                {this.state.images.map((element, index) => {
                        return <FullWidthImage uri={element.uri.substr(9)} key={index}/>
                    }
                )}
            </View>)
        } else if (type === 'video') {
            return  (<View style={{marginTop: 20}}>
                {this.state.videos.map((element, index) => {
                        return <MyVideoPlayer key={index} uri={element.uri.slice(9)}/>
                    }
                )}
            </View>)
        }
    };
    render() {
        return <SafeAreaView style={styles.container}>
            <Header leftElement={
            <TouchableOpacity
                    onPress={this.goBack}
                    style={{width: 45, marginLeft: 10}}>
                    <Icon name="keyboard-arrow-left" size={45} color="#FF5722"/>
                </TouchableOpacity>
        } titleElement='检索'/>
            <View style={styles.rowContainer}>
                <TextInput
                    style={{width: '85%', height: 30, borderColor: '#e0e0e0', borderWidth: 0.5, borderRadius: 5}}/>
                <TouchableOpacity>
                    <FontIcon name="search" size={30} color="#FF5722"/>
                </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
                <Button style={styles.buttonLeft} onClick={() => {
                    this.setState({
                        type: 'audio'
                    });
                    queryAudios().then((audios) => {
                        console.log(audios);
                        this.setState({
                            audios: audios
                        })
                    })
                }}><Text style={{color: 'white'}}>录音</Text></Button>
                <Button style={styles.buttonCenter} onClick={() => {
                    this.setState({
                        type: 'video'
                    });
                    queryVideos().then((videos) => {
                        console.log(videos);
                        this.setState({
                            videos: videos
                        })
                    })
                }}><Text style={{color: 'white'}} >视频</Text></Button>
                <Button style={styles.buttonRight} onClick={() => {
                    this.setState({
                        type: 'image'
                    });
                    queryImages().then((images) => {
                        this.setState({
                            images: images
                        })
                    })
                }}><Text style={{color: 'white'}}>图片</Text></Button>
            </View>
            <ScrollView>
                {this.showContent()}
            </ScrollView>

        </SafeAreaView>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
    buttonCenter: {
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: '#FF5722',
    },
    buttonLeft: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#FF5722'

    },
    buttonRight: {
        // marginRight: 5,
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#FF5722'

    }

});
