import React from 'react';
import {
    SafeAreaView,
    Platform,
    Animated,
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableHighlight,
    FlatList,
    SectionList,
    TouchableWithoutFeedback, TextInput
} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import FontIcon from 'react-native-vector-icons/dist/FontAwesome';
import IIcon from 'react-native-vector-icons/dist/Ionicons';

import {Drawer, Card, SwipeAction, Modal} from 'antd-mobile-rn';
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
    deleteAudio, sortByText, updateNote, queryTypes, updateType, updateTypeNotes
} from "../../database/schemas";

const Spinner = require('react-native-spinkit');
const uuid = require('uuid/v1');
const {width, height} = Dimensions.get('window');

const headerShadow = {
    width: width,
    height: 45,
    color: "#000",
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
            searchContent: '',
            searchColor: '#757575',
            oldType: '',
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
    showSortedNotes = (notes) => {
        this.setState({
            notes: notes
        })
    };

    search = () => {
        // this.props.navigation.navigate('SearchPage', {
        //     showSortedNotes: this.showSortedNotes
        // });
        sortByText(this.state.searchContent).then((notes) => {
            this.setState({
                notes: notes,

            });
            if (this.state.searchContent === '') {
                this.setState({
                    searchColor: '#757575'
                })
            } else {
                this.setState({
                    searchColor: '#FF5722'
                })
            }

        })
    };

    searchByTime = () => {
        this.props.navigation.navigate('MyCalendar', {
            showSortedNotes: this.showSortedNotes
        });
    }

    reloadData = () => {
        queryNotes(this.state.realmObject).then((notes) => {
            this.setState({
                notes: notes,
                realmObject: rememberAllRealm,
                isLoading: false
            });

            rememberAllRealm.addListener('change', () => {
                if (!rememberAllRealm.isInTransaction) {
                    this.reloadData()
                }
            });


        }).catch((error) => {
            this.setState({
                notes: []
            })
        });

    };
    setType = (type, note) => {
        console.log(type);
        updateType(type.toString(), note.id).then(
            () => {
                updateNote({
                    id: note.id,
                    name: note.name,
                    noteType: type,
                    time: note.time,
                    noteContent: note.noteContent
                })
            }
        ).catch((error) => {
            console.log(error)
        });
        if (this.state.oldType !== '') {
            updateTypeNotes(this.state.oldType, note.id)
        }
        // console.log(groupName)
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
        queryTypes().then((types) => {
            console.log(Array.from(types))
        }).catch((error) => {
            console.log(error)
        });
    };


    renderItem = (note, index) => {
        const swipeOutButtons = [
            {
                text: '删除',
                onPress: () => {
                    deleteNote(note.id).catch()
                },
                style: {color: 'white'},
            }, {
                text: '重命名',
                style: {backgroundColor: '#424242', color: 'white'},
                onPress: () => {

                }
            }, {
                text: '分组',
                style: {backgroundColor: '#FF5722', color: 'white'},
                onPress: () => {
                    this.setState({
                        oldType: note.noteType
                    });
                    Modal.prompt(
                        '修改分组',
                        null,
                        [
                            {
                                text: '不保存',
                                onPress: this.cancel,
                                style: 'cancel',
                            },
                            {
                                text: '保存',
                                onPress: type => this.setType(type, note)
                            }

                        ],
                        'default',
                        note.noteType === ''? '' : note.noteType,
                        ['输入分组名']
                    );
                }
            }
        ];

        return (
            <SwipeAction right={swipeOutButtons} key={index} style={{marginBottom: 5}}>
                <TouchableWithoutFeedback onPress={() => this.openNote(note)}>
                    <View key={index} style={{flex: 1, height: 60, width: width, backgroundColor: 'white'}}>
                        <Text>{note.id}</Text>
                        <Text>{note.time.toLocaleString()}</Text>
                    </View>
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
                    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                        <Header leftElement={
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'flex-start'}}
                                    onPress={() => this.drawer && this.drawer.openDrawer()}>
                                    <Icon name="list" size={45} color="#FF5722"/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.reloadData}
                                    style={{flex: 1, justifyContent: 'flex-end'}}
                                >
                                    <Text style={{fontSize: 20, color:"#FF5722"}}>全部</Text>
                                    {/*<IIcon name="md-refresh" size={30} color="#FF5722" title="Go to Details"/>*/}
                                </TouchableOpacity>
                            </View>

                        } titleElement='笔记' rightElement={
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                {/*<TouchableOpacity onPress={this.search} style={{flex: 1, justifyContent: 'flex-start'}}>*/}
                                {/*    <FontIcon name="search" size={30} color="#FF5722" title="Go to Details"/>*/}
                                {/*</TouchableOpacity>*/}
                                <View style={{flex: 1, justifyContent: 'flex-start'}}/>
                                <TouchableOpacity onPress={this.searchByTime}
                                                  style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <IIcon name="ios-calendar" size={30} color="#FF5722" title="Go to Details"/>
                                </TouchableOpacity>
                            </View>
                        }/>
                        <View style={styles.rowContainer}>
                            <FontIcon name="search" size={20} color={this.state.searchColor}/>
                            <TextInput
                                style={{width: '90%', height: 30, borderColor: '#f5f5f5', borderWidth: 0.5, borderRadius: 5,
                                backgroundColor: 'white'}}
                                placeholder='搜索'
                                onBlur={() => {
                                    this.setState({
                                        searchColor: '#757575'
                                    })
                                }}
                                onChangeText={(text) => {
                                    this.state.searchContent = text;
                                    this.search(text);

                                }}
                            />
                        </View>
                        <ScrollView style={{backgroundColor: '#f5f5f5'}}>
                            <FlatList
                                data={this.state.notes}
                                renderItem={({item}) => this.renderItem(item)}
                                keyExtractor={this._keyExtractor}
                            />
                        </ScrollView>
                        {/*<View style={{position: 'absolute', left: 0, right: 0, bottom: 6, alignItems: 'center'}}>*/}
                        {/*    <Svg*/}
                        {/*        height="52"*/}
                        {/*        width="52"*/}
                        {/*    >*/}
                        {/*        <Circle*/}
                        {/*            cx="26"*/}
                        {/*            cy="26"*/}
                        {/*            r="26"*/}
                        {/*            fill="white"*/}
                        {/*        />*/}
                        {/*    </Svg>*/}
                        {/*</View>*/}
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
    rowContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#f5f5f5'
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
});

