import Realm from 'realm';

const NOTE_SCHEMA = "NoteList";
const AUDIO_SCHEMA = "AudioList";
const PICTURE_SCHEMA = "PictureList";
const VIDEO_SCHEMA = "VideoList";

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

const databaseOptions = {
    path: 'rememberAll.realm',
    schema: [NoteSchema, AudioSchema, PictureSchema, VideoSchema]
};

export const queryNotes = (realmObject) => new Promise((resolve, reject) => {
    if (realmObject) {
        rememberAllRealm = realmObject;
        let allNotes = realmObject.objects(NOTE_SCHEMA);
        resolve(allNotes)
    }
    Realm.open(databaseOptions).then((realm) => {
        rememberAllRealm = realm;
        let allNotes = realm.objects(NOTE_SCHEMA);
        resolve(allNotes)
    }).catch(

    )
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
    if (rememberAllRealm.isInTransaction) {
        let deletingNote = rememberAllRealm.objectForPrimaryKey(NOTE_SCHEMA, noteId);
        rememberAllRealm.delete(deletingNote);
        resolve();
    } else {
        rememberAllRealm.write(() => {
            let deletingNote = rememberAllRealm.objectForPrimaryKey(NOTE_SCHEMA, noteId);
            rememberAllRealm.delete(deletingNote);
            resolve();
        })
    }

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


