import Realm from 'realm';

const NOTE_SCHEMA = "NoteList";
const AUDIO_SCHEMA = "AudioList";
const PICTURE_SCHEMA = "PictureList";
const VIDEO_SCHEMA = "VideoList";
const TYPE_SCHEMA = "TypeList";
export let rememberAllRealm;

export const NoteSchema = {
    name: NOTE_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        time: 'date',
        noteType: 'string',
        noteContent: 'string[]',
    }
};

export const AudioSchema = {
    name: AUDIO_SCHEMA,
    primaryKey: 'uuid',
    properties: {
        uuid: 'string',
        noteId: 'string',
    }
};

export const PictureSchema = {
    name: PICTURE_SCHEMA,
    primaryKey: 'uri',
    properties: {
        uri: 'string',
        noteId: 'string',
    }
};

export const VideoSchema = {
    name: VIDEO_SCHEMA,
    primaryKey: 'uri',
    properties: {
        uri: 'string',
        noteId: 'string',
    }
};

export const TypeSchema = {
    name: TYPE_SCHEMA,
    primaryKey: 'type',
    properties: {
        type: 'string',
        notes: 'string[]',
    }
};
const databaseOptions = {
    path: 'rememberAll.realm',
    schema: [NoteSchema, AudioSchema, PictureSchema, VideoSchema, TypeSchema]
};
export const buildRealm = () => new Promise((resolve, reject) =>{
        Realm.open(databaseOptions).then((realm) => {
            rememberAllRealm = realm;
            resolve(realm);
        });

    });

export const queryNotes = (realmObject) => new Promise((resolve, reject) => {
    if (realmObject) {
        let allNotes = realmObject.objects(NOTE_SCHEMA);
        resolve(allNotes)
    } else {
        let allNotes = rememberAllRealm.objects(NOTE_SCHEMA);
        resolve(allNotes)
    }


});

export const queryTypes = () => new Promise((resolve, reject) => {
        let allTypes = rememberAllRealm.objects(TYPE_SCHEMA);
        resolve(allTypes)
});

export const updateType = (type, noteId) => new Promise((resolve, reject) => {

            let result = Array.from(rememberAllRealm.objects(TYPE_SCHEMA).filtered('type == $0', type));
            console.log('result', Array.from(result));
            if (result.length === 0) {
                insertType(type, noteId)
            } else {
                console.log('喵喵喵');
                let updatingType = rememberAllRealm.objectForPrimaryKey(TYPE_SCHEMA, type);
                updatingType.notes.push(noteId);
            }
            resolve()

});

export const updateTypeNotes = (type, noteId) => new Promise((resolve, reject) => {
    if (rememberAllRealm.isInTransaction) {
        let updatingType = rememberAllRealm.objectForPrimaryKey(TYPE_SCHEMA, type);

        if (updatingType.notes.length === 1) {
            rememberAllRealm.delete(updatingType)
        } else {
            const oldNotes = updatingType.notes;
            const index = oldNotes.indexOf(noteId);
            if (index > -1) {
                oldNotes.splice(index, 1);
            }
            updatingType.notes = oldNotes;
        }
        resolve()
    } else {
        rememberAllRealm.write(() => {
            let updatingType = rememberAllRealm.objectForPrimaryKey(TYPE_SCHEMA, type);

            if (updatingType.notes.length === 1) {
                rememberAllRealm.delete(updatingType)
            } else {
                const oldNotes = updatingType.notes;
                const index = oldNotes.indexOf(noteId);
                if (index > -1) {
                    oldNotes.splice(index, 1);
                }
                updatingType.notes = oldNotes;
            }
        })
    }

});

export const deleteType = (type) => new Promise((resolve, reject) => {
    rememberAllRealm.write(() => {
        let deletingType = rememberAllRealm.objectForPrimaryKey(TYPE_SCHEMA, type);
        deletingType.notes.forEach((noteId) => {
            let updatingNote = rememberAllRealm.objectForPrimaryKey(NOTE_SCHEMA, noteId);
            updatingNote.type = '';
            updateNote(updatingNote).catch((error) => {
                console.log(error)
            });
        });
        rememberAllRealm.delete(deletingType)
    })
});

export const queryAudios = () => new Promise((resolve, reject) => {
    rememberAllRealm.write(() => {
        let allAudios = rememberAllRealm.objects(AUDIO_SCHEMA);
        resolve(allAudios)
    })


});

export const queryVideos = () => new Promise((resolve, reject) => {
    rememberAllRealm.write(() => {
        let allVideos = rememberAllRealm.objects(VIDEO_SCHEMA);
        resolve(allVideos)
    });

});

export const queryImages = () => new Promise((resolve, reject) => {
    rememberAllRealm.write(() => {
        let allPictures = rememberAllRealm.objects(PICTURE_SCHEMA);
        resolve(allPictures)
    })



});

export const insertNote = (newNote) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        rememberAllRealm.create(NOTE_SCHEMA, newNote);
        resolve(newNote);
    } else {
        rememberAllRealm.write(() => {
            rememberAllRealm.create(NOTE_SCHEMA, newNote);
            resolve(newNote);
        });
    }
});

export const updateNote = (note) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        let updatingNote = rememberAllRealm.objectForPrimaryKey(NOTE_SCHEMA, note.id);
        updatingNote.name = note.name;
        updatingNote.time = note.time;
        updatingNote.noteType = note.noteType;
        updatingNote.noteContent = note.noteContent;
        resolve();
    } else {
        rememberAllRealm.write(() => {
            let updatingNote = rememberAllRealm.objectForPrimaryKey(NOTE_SCHEMA, note.id);
            updatingNote.name = note.name;
            updatingNote.time = note.time;
            updatingNote.noteType = note.noteType;
            updatingNote.noteContent = note.noteContent;
            resolve();
        })
    }
});

export const deleteNote = (noteId) => new Promise((resolve, reject) => {
            let deletingNote = rememberAllRealm.objectForPrimaryKey(NOTE_SCHEMA, noteId);
            deletingNote.noteContent.forEach((value) => {
                let contentType = value.slice(0, 9);
                switch (contentType) {
                    case '*#audio#*':
                        deleteAudio(value).catch((error) => {
                            console.log(error)
                        });
                        return;
                    case '*#image#*':
                        deletePicture(value).catch((error) => {
                            console.log(error)
                        });
                        return;
                    case '*#video#*':
                        deleteVideo(value).catch((error) => {
                            console.log(error)
                        });
                        return;
                    default:
                        return;
                }
            });
            if (deletingNote.noteType !== '') {
                updateTypeNotes(deletingNote.noteType, noteId).catch((error) => {
                    console.log(error)
                });
            }
            rememberAllRealm.delete(deletingNote);
            resolve();
});

export const insertAudio = (newAudio) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        rememberAllRealm.create(AUDIO_SCHEMA, newAudio);
        resolve(newAudio);
    } else {
        rememberAllRealm.write(() => {
            rememberAllRealm.create(AUDIO_SCHEMA, newAudio);
            resolve(newAudio);
        });
    }

    console.log('audio数据库存在', rememberAllRealm.path);
});

export const deleteAudio = (audioId) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        let deletingAudio = rememberAllRealm.objectForPrimaryKey(AUDIO_SCHEMA, audioId);
        console.log('删除', deletingAudio);
        rememberAllRealm.delete(deletingAudio);
        resolve();
    } else {
        rememberAllRealm.write(() => {
            let deletingAudio = rememberAllRealm.objectForPrimaryKey(AUDIO_SCHEMA, audioId);
            console.log('删除', deletingAudio);
            rememberAllRealm.delete(deletingAudio);
            resolve();
        })
    }

});
export const insertType = (type, noteId) => new Promise((resolve, reject) => {
        rememberAllRealm.create(TYPE_SCHEMA, {type: type, notes: [noteId]});
        resolve();
});


export const insertPicture = (newPicture) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        rememberAllRealm.create(PICTURE_SCHEMA, newPicture);
        resolve(newPicture);
    } else {
        rememberAllRealm.write(() => {
            rememberAllRealm.create(PICTURE_SCHEMA, newPicture);
            resolve(newPicture);
        });
    }
});

export const deletePicture = (pictureId) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        console.log(pictureId);
        let deletingPicture = rememberAllRealm.objectForPrimaryKey(PICTURE_SCHEMA, pictureId);
        console.log('删除', deletingPicture);
        rememberAllRealm.delete(deletingPicture);
        resolve();
    } else {
        rememberAllRealm.write(() => {
            let deletingPicture = rememberAllRealm.objectForPrimaryKey(PICTURE_SCHEMA, pictureId);
            console.log('删除', deletingPicture);
            rememberAllRealm.delete(deletingPicture);
            resolve();
        })
    }

});

export const insertVideo = (newVideo) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        rememberAllRealm.create(VIDEO_SCHEMA, newVideo);
        resolve(newVideo);
    } else {
        rememberAllRealm.write(() => {
            rememberAllRealm.create(VIDEO_SCHEMA, newVideo);
            resolve(newVideo);
        });
    }
});

export const deleteVideo = (videoId) => new Promise((resolve, reject) => {

    if (rememberAllRealm.isInTransaction) {
        let deletingVideo = rememberAllRealm.objectForPrimaryKey(VIDEO_SCHEMA, videoId);
        console.log('删除', deletingVideo);
        rememberAllRealm.delete(deletingVideo);
        resolve();
    } else {
        rememberAllRealm.write(() => {
            let deletingVideo = rememberAllRealm.objectForPrimaryKey(VIDEO_SCHEMA, videoId);
            console.log('删除', deletingVideo);
            rememberAllRealm.delete(deletingVideo);
            resolve();
        })
    }

});

export const beginTrans = () => new Promise((resolve, reject) => {
    if (!rememberAllRealm.isInTransaction) {
        rememberAllRealm.beginTransaction();
        resolve();
    }
});

export const cancelTrans = () => new Promise((resolve, reject) => {

    rememberAllRealm.cancelTransaction();
    resolve();

});

export const commitTrans = () => new Promise((resolve, reject) => {
    rememberAllRealm.commitTransaction();
    resolve()
});

export const sortByTime = (startTime, endTime) => new Promise((resolve, reject) => {
    console.log(startTime, endTime);
    let startDate = new Date(startTime+'T00:00:00');
    let endDate = new Date(endTime+'T24:00:00');
    console.log(endDate);
    let notes = rememberAllRealm.objects(NOTE_SCHEMA);
    let sortedNotes = notes.filtered('time >= $0 AND time <= $1', startDate, endDate);
    console.log(Array.from(sortedNotes));
    resolve(sortedNotes)
});

export const sortById = (notes) => new Promise((resolve, reject) => {
    let result = [];
    notes.forEach((id, index) => {
        let note = rememberAllRealm.objectForPrimaryKey(NOTE_SCHEMA, id);
        console.log(note);
        result.push(note);
    });
    console.log(result);
    resolve(result);
});


export const sortByText = (text) => new Promise((resolve, reject) => {
    // console.log(startTime, endTime);
    console.log(text);
    text = text.toLowerCase();
    // text = 'am';
    let notes = rememberAllRealm.objects(NOTE_SCHEMA);
    let sortedNotes = notes.filter(obj => { return obj.noteContent.reduce((aac, content)  => {
        if (text === '') {
            return true
        }
        if (content.slice(0, 9) === '*#audio#*' || content.slice(0, 9) === '*#video#*' || content.slice(0, 9) === '*#image#*') {
            return aac
        }
        if(content.toLowerCase().indexOf(text) > -1){
            console.log(true, content);
            return true
        }

        return aac

    }, false)});
    console.log(Array.from(sortedNotes));
    resolve(sortedNotes)
});

