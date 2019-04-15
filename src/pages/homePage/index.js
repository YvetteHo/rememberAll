import React from 'react';
import {SafeAreaView, Platform, Animated, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, TouchableHighlight, FlatList, SectionList, TouchableWithoutFeedback} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import FontIcon from 'react-native-vector-icons/dist/FontAwesome' ;
import IIcon from 'react-native-vector-icons/dist/Ionicons';

import {Drawer, Button, WhiteSpace, Card, SwipeAction} from 'antd-mobile-rn';
import Header from "../../components/header";
import {
    insertNote,
    NoteSchema,
    AudioSchema,
    queryNotes,
    deleteNote,
    rememberAllRealm,
    beginTrans,
    commitTrans,
    cancelTrans,
    deleteAudio
} from "../../database/schemas";
import AudioOperation from "../../components/audioOperation";
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker'

const Spinner = require('react-native-spinkit');
const uuid = require('uuid/v1');
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
const DEMO_OPTIONS = ['录音', '图片', '视频'];

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddClicked: false,
            drawerOpen: false,
            notes: [],
            openNote: true,
            realmObject: null,
            isLoading: false,
        };
        this.openNote = this.openNote.bind(this);

    }
    componentDidMount() {
        this.setState({
            isLoading: false
        });
        this.reloadData()
    }
    componentWillUnmount() {
        if (rememberAllRealm.isInTransaction) {
            cancelTrans().catch(() => {

            });
        }
    }

    search = () => {
        this.props.navigation.navigate('SearchPage')
    };

    searchByTime = () => {
        this.props.navigation.navigate('MyCalendar')

    }

    reloadData = () => {
        queryNotes(this.state.realmObject).then((notes) => {
            this.setState({
                notes: notes,
                realmObject: rememberAllRealm,
                isLoading: false
            });

            rememberAllRealm.addListener('change', () => {
                if (! rememberAllRealm.isInTransaction) {
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
        this.setState({
            openNote: true
        });

        beginTrans().catch(() => {

        });

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
            insertNote(newNote).then(() => {
                this.props.navigation.navigate('NewNote', {
                    note: newNote,
                    isNew: true
                })
            }).catch(() => {

            });
        }

    };

    onOpenChange = (isOpen) => {
        /* tslint:disable: no-console */
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    };



    renderItem = (note, index) => {
        const swipeOutButtons = [
            {
                text: '删除',
                onPress: () => {
                    Array.from(note.noteContent).forEach((element) => {
                        if (element.slice(0, 9) === '*#audio#*') {
                            deleteAudio(element).catch(() => {})
                        }
                    });
                    deleteNote(note.id).catch(() => {});
                },
                style: {color: 'white'},
            }, {
                text: '重命名',
                style: {backgroundColor: '#424242', color: 'white'},
                onPress: () => {
                }
            },{
                text: '分组',
                style: {backgroundColor: '#FF5722', color: 'white'},
                onPress: () => {

                }
            }
        ];

        return (
            <SwipeAction right={swipeOutButtons} key={index}>
            <TouchableWithoutFeedback onPress={() => this.openNote(note)}>
            <Card full key={index}>
                <Card.Body>
                    <View style={{ height: 42 }}>
                        <Text style={{ marginLeft: 16 }}>{note.id}</Text>
                    </View>
                </Card.Body>
                <Card.Footer content={note.time.toLocaleString()} extra="footer extra content" />
            </Card>
            </TouchableWithoutFeedback>
            </SwipeAction>
        )

    };


    _keyExtractor = (item) => item.id;

    render() {
        navigator = this.props.navigation;
        const sidebar = (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
             <ScrollView style={{backgroundColor: 'white'}}>
                 <Text>侧边栏</Text>
             </ScrollView>
            </SafeAreaView>
        );

        return (
            <View style={styles.container}>
                {this.state.isLoading ? <View style={styles.maskView}/> : <View/>}
                {this.state.isLoading ?
                    <View style={styles.floatView}>
                        <Spinner style={styles.spinner} isVisible={true} size={100} type='Circle' color='#FF5722'/>
                    </View> : <View/>}
                <Drawer sidebar={sidebar} position='left'
                        open={false} drawerRef={el => (this.drawer = el)}
                        onOpenChange={this.onOpenChange}
                        drawerBackgroundColor='#ccc'>
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>


                    <Header leftElement={
                        <TouchableOpacity
                            onPress={() => this.drawer && this.drawer.openDrawer()}
                            style={{width: 45, marginLeft: 10}}>
                            <Icon name="list" size={45} color="#FF5722"/>
                        </TouchableOpacity>
                    } titleElement='笔记' rightElement={
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.search} style={{flex: 1, justifyContent: 'flex-start'}}>
                                <FontIcon name="search" size={30} color="#FF5722" title="Go to Details"/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.searchByTime} style={{flex: 1, justifyContent: 'flex-end'}}>
                                <IIcon name="ios-calendar" size={30} color="#FF5722" title="Go to Details"/>
                            </TouchableOpacity>
                        </View>




                    }/>

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
                    <View style={{left: 0, right: 0, bottom: 0, alignItems: 'center'}}>

                        <TouchableOpacity onPress={() => this.openNote(null)} style={styles.button}>
                            <Icon name="add-circle" size={64} color="#FF5722" title="Go to Details"/>
                        </TouchableOpacity>

                    </View>
            </SafeAreaView>
                </Drawer>
            </View>

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
    spinner: {
        marginBottom: 50
    },
    maskView: {
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
    blackMaskView: {
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

});

