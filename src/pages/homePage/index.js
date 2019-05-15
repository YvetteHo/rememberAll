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
    TouchableWithoutFeedback,
    TextInput,
    AsyncStorage
} from 'react-native';
import Svg, {Path, G, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import FontIcon from 'react-native-vector-icons/dist/FontAwesome';
import IIcon from 'react-native-vector-icons/dist/Ionicons';
import {getData, postData, upload} from '../../components/http';

import {Drawer, Card, SwipeAction, Modal, Button} from 'antd-mobile-rn';
import Header from "../../components/header";
import {
    insertNote,
    queryNotes,
    deleteNote,
    beginTrans,
    commitTrans,
    cancelTrans,
    sortByText,
    updateNote,
    queryTypes,
    updateType,
    updateTypeNotes,
    buildRealm, sortById, sortByMediaType,rememberAllRealm
} from "../../database/schemas";
import SideBar from "../../components/sideBar";
import Uploader from "../../components/upload";
import {DocumentDirectoryPath} from "react-native-fs";

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

const excuteUpload = new Promise((resolve, reject) => {

});

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
            types: [],
            notesOnSearch: [],
            userId: '',
        };
        this.openNote = this.openNote.bind(this);
        AsyncStorage.getItem('operations').then((response) => {
            const operations = JSON.parse(response);
            const uploader = new Uploader(operations);
            uploader.upload();
        });
    }

    componentDidMount() {


        AsyncStorage.getItem('userId').then((response) => {
            this.setState({
                userId: response
            })
        });
        AsyncStorage.getItem('operations').then((response) => {
            let operations = JSON.parse(response);
            console.log('所有操作', operations);
        });


        buildRealm().then(() => {

            queryNotes().then((notes) => {
                this.setState({
                    notesOnSearch: notes,
                    notes: notes,
                    isLoading: false,
                });
                console.log(Array.from(notes))
                queryTypes().then((types) => {
                    this.setState({
                        types: types
                    });
                }).catch((error) => {
                    console.log(error)
                });
                rememberAllRealm.addListener('change', () => {
                    if (!rememberAllRealm.isInTransaction) {
                        this.reloadData();
                        console.log('change');
                    }
                });

            });
        });

        this.setState({
            isLoading: false
        });

    }

    componentWillUnmount() {
        if (rememberAllRealm.isInTransaction) {
            cancelTrans().catch(() => {

            });
        }
    }
    showSortedNotes = (notes) => {
        this.setState({
            notesOnSearch: notes,
            notes: notes
        })
    };

    search = () => {

        sortByText(this.state.notesOnSearch, this.state.searchContent).then((notes) => {
            this.setState({
                notes: notes,
            });
            if (this.state.searchContent === '') {
                this.setState({
                    searchColor: '#757575',
                })
            } else {
                this.setState({
                    searchColor: '#FF5722',

                })
            }

        })
    };

    searchByTime = () => {
        this.props.navigation.navigate('MyCalendar', {
            showSortedNotes: this.showSortedNotes
        });
    };

    reloadData = () => {
        queryNotes().then((notes) => {

            this.setState({
                notesOnSearch: notes,
                notes: notes,
                isLoading: false,
            });

        }).catch((error) => {
            console.log(error);
            this.setState({
                notes: []
            })
        });
        queryTypes().then((types) => {
            this.setState({
                types: types
            });
        }).catch((error) => {
            console.log(error)
        });

    };
    setType = (type, note) => {
        beginTrans().then(
            updateType(type.toString(), note.id).then(() => {
                updateNote({
                    id: note.id,
                    name: note.name,
                    noteType: type,
                    time: note.time,
                    noteContent: note.noteContent,
                    noteSkeleton: note.noteSkeleton
                }).then(() => {
                    AsyncStorage.getItem('operations').then((response) => {
                        let operations = JSON.parse(response);
                        operations.push({
                            'updateType': {
                                noteId: note.id,
                                noteType: type.toString()
                            }
                        });
                        AsyncStorage.setItem('operations', JSON.stringify(operations))
                    });
                    if (this.state.oldType !== '') {
                        updateTypeNotes(this.state.oldType, note.id).then(() => {
                            commitTrans()
                        })
                    } else {
                        commitTrans();
                    }
                })
            }).catch(() => {
                cancelTrans()
            })
        );
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
            // postData('http://127.0.0.1:8000/notes/', {
            //     id: '',
            //     name: '',
            //     time: new Date(),
            //     noteType: '',
            //     noteContent: JSON.stringify([]),
            //     noteSkeleton: JSON.stringify([]),
            //     user: 'http://127.0.0.1:8000/users/771dbc34-7335-11e9-8e7a-acde48001122/',
            // }).then((response) => {
            //     response.json().then(response => {
            //         console.log(response)
            //     })
            // });

            let noteId = uuid();
            let noteDate = new Date();
            // AsyncStorage.getItem('operations').then((response) => {
            //     let operations = JSON.parse(response);
            //     operations.append({'newNote': {
            //             id: noteId,
            //             name: '',
            //             time: noteDate,
            //             noteType: '',
            //             noteContent: [],
            //             noteSkeleton: [],
            //             user: 'http://127.0.0.1:8000/users/' + this.state.userId
            //         }});
            //     AsyncStorage.setItem('operations', JSON.stringify(operations)).then(() => {
                    const newNote = {
                        id: noteId,
                        name: '',
                        time: noteDate,
                        noteType: '',
                        noteContent: [],
                    };
                    insertNote(newNote).then(() => {
                        this.props.navigation.navigate('NewNote', {
                            note: newNote,
                            isNew: true
                        })
                    }).catch(() => {

                    })

                // })
            // });
        }

    };

    onOpenChange = (isOpen) => {
        /* tslint:disable: no-console */
        this.setState({
            drawerOpen: !this.state.drawerOpen
        });

    };


    renderItem = (note, index) => {
        const swipeOutButtons = [
            {
                text: '重命名',
                style: {color: 'white'},

                onPress: () => {

                }
            }, {
                text: '分组',
                style: {backgroundColor: '#424242', color: 'white'},

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
            }, {
                text: '删除',
                onPress: () => {
                    beginTrans();
                    let noteId = note.id;
                    deleteNote(note.id).then(() => {
                        AsyncStorage.getItem('operations').then((response) => {
                            let operations = JSON.parse(response);
                            operations.push({
                                'deleteNote': noteId
                            });
                            AsyncStorage.setItem('operations', JSON.stringify(operations))
                        });
                        commitTrans()

                    }).catch((error) => {
                        console.log(error);
                        cancelTrans();

                    })
                },
                style: {backgroundColor: '#FF5722', color: 'white'},
            }
        ];

        let types = this.state.types.map((value, index) => {
            return value.type
        });

        let typeIndex = types.indexOf(note.noteType);
        console.log(types, typeIndex)
        let colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#03a9f4'];

        return (
            <SwipeAction right={swipeOutButtons} key={index} style={{marginBottom: 5}}>
                <TouchableWithoutFeedback onPress={() => this.openNote(note)}>
                    <View key={index} style={[styles.noteContainer2, {flex: 1, height: 60, width: width, backgroundColor: 'white'}]}>
                        <View style={styles.noteContainer}>
                            <View style={styles.rowContainer}>
                                <Text style={{marginRight: 10}}>{note.noteSkeleton[0]}</Text>
                                {typeIndex !== -1 ? <IIcon name="ios-bookmark" size={15} color={colors[typeIndex]}/> : <View/>}
                                    </View>
                            <View style={styles.rowContainer}>
                                <Text>{note.time.toLocaleString()}</Text>
                                {note.noteSkeleton[1] === 'true' ? <Icon name="mic" size={15} color="#FF5722"/> : <View/>}
                                {note.noteSkeleton[2] === 'true' ? <Icon name="videocam" size={15} color="#FF5722"/> : <View/>}
                            </View>
                        </View>
                        {note.noteSkeleton[3] !== '' ? <Image
                            key={index}
                            source={{uri: DocumentDirectoryPath + '/images/' + note.noteSkeleton[3] + '.jpg'}}
                            style={{width: 50, height: 50, justifyContent: 'flex-end', marginRight: 10, resizeMode: 'cover'}}
                        /> : <View/>}

                    </View>
                </TouchableWithoutFeedback>
            </SwipeAction>
        )

    };
    renderSideItem = (item, index) => {
        let colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#03a9f4'];

        return (
            <TouchableOpacity>
                <View style={styles.typesContainer}>
                    <IIcon name="ios-bookmark" size={45} color={colors[index]}/>
                    <Text style={{flex: 1, marginLeft: 10}}>{item.type}</Text>
                    <Text style={{justifyContent: 'flex-end'}}>{item.notes.length}</Text>
                </View>
            </TouchableOpacity>
        )
    };
    selectType = (type) => {
        let notes = Array.from(sortById(type.notes));
        sortById(type.notes).then((notes) => {
            this.setState({
                notesOnSearch: notes,
                notes: notes
            })
            this.drawer && this.drawer.closeDrawer();
        }).catch((error) => {
            console.log(error)
        })

        // console.log(Array.from(type.notes));
    };
    selectByMedia = (type) => {
        sortByMediaType(type).then((notes) => {
            console.log(notes);
            this.setState({
                notes: notes,
                notesOnSearch: notes
            });
            // console.log(Array.from(notes.noteSkeleton))
            this.drawer && this.drawer.closeDrawer();
        })
    };
// `http://127.0.0.1:8000/user/?id=${userId}`
    fetch = () => {
        // this.getData('http://127.0.0.1:8000/users', {'userId': '2'})
        // this.postData('http://127.0.0.1:8000/users/', {
        //     "id": 'ab46f6c2-72e2-11e9-a61d-acde48001122',
        //     "name": '1',
        //     "password": '234',
        // })

        // this.getData('http://127.0.0.1:8000/notes/1', {})


    };
    // fetchUserById = () => {
    //     fetch('http://127.0.0.1:8000/users', {
    //         method: 'GET',
    //         headers: {
    //             'userId': '2'
    //         }
    //     }).then((response) => {
    //         console.log(response)
    //     })
    // };

    // getData = (url, header) => {
    //     fetch(url, {
    //         method: 'GET',
    //         headers: header
    //     }).then((response) => {
    //         console.log(response)
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // };

    postData = (url, data) => {
        // Default options are marked with *
        return fetch(url, {
            body: JSON.stringify(data), // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
            .then(response => {
                console.log(response)
            }) // parses response to JSON
    };

    _keyExtractor = (item, index) => item.id;
    _keyExtractorForSideBar = (item, index) => item.type;
    render() {
        navigator = this.props.navigation;

        const sidebar = <SideBar types={this.state.types}
                                 selectType={(type) => {this.selectType(type)}}
                                 selectByMedia={(type) => {this.selectByMedia(type)}}/>;
            {/*<SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>*/}
            {/*    <ScrollView style={{backgroundColor: 'white'}}>*/}
            {/*        <FlatList*/}
            {/*            data={this.state.types}*/}
            {/*            renderItem={({item, index}) => this.renderSideItem(item, index)}*/}
            {/*            keyExtractor={this._keyExtractorForSideBar}*/}
            {/*        />*/}
            {/*    </ScrollView>*/}
            {/*</SafeAreaView>*/}

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
                        <View style={styles.searchContainer}>
                            <FontIcon name="search" size={20} color={this.state.searchColor}/>
                            <TextInput
                                style={{width: '90%', height: 30, borderColor: '#f5f5f5', borderWidth: 0.5, borderRadius: 5,
                                backgroundColor: 'white'}}
                                placeholder='搜索'
                                onBlur={() => {
                                    this.setState({
                                        searchColor: '#757575',
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
                                renderItem={({item, index}) => this.renderItem(item, index)}
                                keyExtractor={this._keyExtractor}
                            />
                        </ScrollView>
                        <Button onClick={this.fetch}>fetch</Button>
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
    searchContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#f5f5f5'
    },
    rowContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    noteContainer2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
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
    noteContainer: {
        // justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        width: '80%'
        // backgroundColor: '#f5f5f5'
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

