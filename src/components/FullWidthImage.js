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
    Image
} from 'react-native';
import Placeholder from 'rn-placeholder';

const dimensions = Dimensions.get('window');

export default class FullWidthImage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pictureWidth: 0,
            pictureHeight: 0,
            isReady: false
        };
    }
    componentDidMount() {
        Image.getSize(this.props.uri, (width, height) => {
            let imageScale = width / height;
            this.setState({
                pictureHeight: dimensions.width / imageScale,
                pictureWidth: dimensions.width,
                isReady: true
            })
        }, (failure) => {
            console.log(this.props.uri)
        });
    }

    render() {
        console.log(this.state.pictureHeight, this.state.pictureWidth);

        return <View>
                <Placeholder.ImageContent
                    size={300}
                    animate="fade"
                    lineNumber={0}
                    // lineSpacing={5}
                    // lastLineWidth="30%"
                    onReady={this.state.isReady}
                >
                    <Image
                        key={this.props.index}
                        source={{uri: this.props.uri}}
                        style={{width: this.state.pictureWidth, height: this.state.pictureHeight}}
                    />
                </Placeholder.ImageContent>
            </View>

    }
}
