import React from 'react';
import {SafeAreaView, Platform, Animated, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, TouchableHighlight, FlatList, SectionList, TouchableWithoutFeedback} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {Drawer, Button, WhiteSpace, Card} from 'antd-mobile-rn';
import Header from "../../components/header";
import {insertNote, NoteSchema, AudioSchema, queryNotes, deleteNote, rememberAllRealm, beginTrans, commitTrans, cancelTrans} from "../../database/schemas";
import { UltimateListView, UltimateRefreshView } from 'react-native-ultimate-listview';

const uuid = require('uuid/v1');
const { width, height } = Dimensions.get('window');

let FlatListItem = props => {
    return (
        <Text>你是狗吧</Text>
    )
};
// const SafeAreaView = withSafeArea(View, 'margin', 'all');
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



export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddClicked: false,
            drawerOpen: true,
            notes: [],
            openNote: true,
        };
        this.openNote = this.openNote.bind(this);

    }
    componentDidMount() {
        this.reloadData();

    }



    reloadData = () => {
        queryNotes().then((notes) => {
            this.setState({
                notes: notes,
            });

            rememberAllRealm.addListener('change', () => {
                if (! rememberAllRealm.isInTransaction) {
                    console.log('change');
                    this.reloadData()
                }
            });


        }).catch((error) => {
            this.setState({
                notes: []
            })
        });
    };

    openNote = (note) => {

        beginTrans();
        this.setState({
            openNote: true
        });
        console.log('打开', note);
        if (note) {

            this.props.navigation.navigate('NewNote', {
                note: note,
                isNew: false,
            })
        } else {
            const newNote = {
                id: uuid(),
                name: '',
                time: new Date(),
                noteType: '',
                noteContent: [],
            };

            insertNote(newNote, true);

            console.log('newNote', newNote);

            this.props.navigation.navigate('NewNote', {
                note: newNote,
                isNew: true
            })
        }

    };

    onOpenChange = (isOpen) => {
        /* tslint:disable: no-console */
    };

    convertDate = (date) => {
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay()
    };

    renderItem = (note) => {


        return (
            <TouchableWithoutFeedback onPress={() => this.openNote(note)}>
            <Card full >
                <Card.Body>
                    <View style={{ height: 42 }}>
                        <Text style={{ marginLeft: 16 }}>{note.id}</Text>
                    </View>
                </Card.Body>
                <Card.Footer content={this.convertDate(note.time)} extra="footer extra content" />
            </Card>
            </TouchableWithoutFeedback>
        )

    };



    _keyExtractor = (item) => item.id;

    render() {
        navigator = this.props.navigation;
        const sidebar = (
            <ScrollView style={{backgroundColor: 'white'}}>
                <Text>你是狗吧</Text>
            </ScrollView>
        );

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Drawer sidebar={sidebar} position='left'
                        open={false} drawerRef={el => (this.drawer = el)}
                        onOpenChange={this.onOpenChange}
                        drawerBackgroundColor='#ccc'>
                    <Header leftElement={
                        <TouchableOpacity
                            onPress={() => this.drawer && this.drawer.openDrawer()}
                            style={{width: 45, marginLeft: 10}}>
                            <Icon name="list" size={45} color="#FF5722"/>
                        </TouchableOpacity>
                    } titleElement='笔记'/>

                    <ScrollView>
                        <FlatList
                            data={this.state.notes}
                            renderItem={({item}) => this.renderItem(item)}
                            keyExtractor={this._keyExtractor}
                        />

                    </ScrollView>
                    <View style={{position: 'absolute', left: 0, right: 0, bottom: 6, alignItems: 'center'}}>
                        <Svg
                            height="52"
                            width="52"
                        >
                            <Circle
                                cx="26"
                                cy="26"
                                r="26"
                                fill="white"
                            />
                        </Svg>
                    </View>
                    <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>

                        <TouchableOpacity onPress={() => this.openNote(null)} style={styles.button}>
                            <Icon name="add-circle" size={64} color="#FF5722" title="Go to Details"/>
                        </TouchableOpacity>

                    </View>

                </Drawer>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        padding: 0,
    },
    countContainer: {
        alignItems: 'center',
        padding: 10
    },
    countText: {
        color: '#FF00FF'
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },

});

