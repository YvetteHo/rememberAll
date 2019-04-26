import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import VideoPlayer from 'react-native-video-player';


export default class MyVideoPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            video: { width: 180, height: 270, duration: undefined },
            // thumbnailUrl: undefined,
            videoUrl: undefined,
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <View>
                {/*<Text style={{ fontSize: 22, marginTop: 22 }}>React Native Video Player</Text>*/}
                <VideoPlayer
                    endWithThumbnail
                    // thumbnail={{ uri: this.state.thumbnailUrl }}
                    video={{ uri: this.props.uri }}
                    videoWidth={this.state.video.width}
                    videoHeight={this.state.video.height}
                    duration={this.state.video.duration}
                    ref={r => this.player = r}
                />
            </View>
        );
    }
}