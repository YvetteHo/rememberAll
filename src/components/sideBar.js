import React from 'react';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView, FlatList, SafeAreaView} from 'react-native';
import {BoxShadow} from 'react-native-shadow'
import IIcon from "react-native-vector-icons/dist/Ionicons";
import {Drawer, Card, SwipeAction, Modal, Button} from 'antd-mobile-rn';
import {queryAudios, queryImages, queryVideos} from "../database/schemas";
import Icon from "react-native-vector-icons/dist/MaterialIcons";

const { width, height } = Dimensions.get('window');
const headerShadow = {
    width: width,
    height: 45,
    color:"#000",
    border: 1.5,
    radius: 0,
    opacity: 0.2,
    x: 0,
    y: 1.5,
};

export default class SideBar extends React.Component {

    _keyExtractorForSideBar = (item, index) => item.type;

    selectType = (type) => {
        this.props.selectType(type);
    };
    selectByMedia = (type) => {
        this.props.selectByMedia(type);
    };

    renderSideItem = (item, index) => {
        let colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#03a9f4'];

        return (
            <TouchableOpacity onPress={() => this.selectType(item)}>
                <View style={styles.typesContainer}>
                    <IIcon name="ios-bookmark" size={45} color={colors[index]}/>
                    <Text style={{flex: 1, marginLeft: 10}}>{item.type}</Text>
                    <Text style={{justifyContent: 'flex-end'}}>{item.notes.length}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    render() {

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View>
                        <TouchableOpacity onPress={() => this.selectByMedia('audio')}>

                        <View style={styles.typesContainer}>
                            <Icon name="mic" size={35} color="#FF5722"/>
                            <Text style={{flex: 1, marginLeft: 10}}>录音笔记</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.selectByMedia('image')}>

                        <View style={styles.typesContainer}>
                            <Icon name="camera" size={35} color="#FF5722"/>
                            <Text style={{flex: 1, marginLeft: 10}}>图片笔记</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.selectByMedia('video')}>

                        <View style={styles.typesContainer}>
                            <Icon name="videocam" size={35} color="#FF5722"/>
                            <Text style={{flex: 1, marginLeft: 10}}>视频笔记</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                    <Text>笔记类型</Text>
                    <FlatList
                        data={this.props.types}
                        renderItem={({item, index}) => this.renderSideItem(item, index)}
                        keyExtractor={this._keyExtractorForSideBar}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        height: 45,
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    typesContainer: {
        // justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 30,
        marginTop: 10,
        marginBottom: 10,
        // backgroundColor: '#f5f5f5'
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

    },
    headerCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    headerLeft: {
        marginLeft: 5,
        flex: 1,
    },
    headerRight: {
        marginRight: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleFont: {
        fontSize: 20,
    }
});
