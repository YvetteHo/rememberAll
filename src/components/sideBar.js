import React from 'react';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView, FlatList, SafeAreaView} from 'react-native';
import {BoxShadow} from 'react-native-shadow'
import IIcon from "react-native-vector-icons/dist/Ionicons";
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

    renderSideItem = (item, index) => {
        let colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#03a9f4'];

        console.log(item.type, index);
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
