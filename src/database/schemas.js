import Realm from 'realm';

const NOTE_SCHEMA = "NoteList";
const AUDIO_SCHEMA = "AudioList";




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

const databaseOptions = {
    path: 'rememberAll.realm',
    schema: [NoteSchema, AudioSchema]
};

export const insertNote = (newNote, isInTrans) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        if (isInTrans) {
            realm.create(NOTE_SCHEMA, newNote);
            resolve(newNote);
        } else {
            realm.write(() => {
                realm.create(NOTE_SCHEMA, newNote);
                resolve(newNote);
            });
        }

    }).catch((error) => reject(error));
});

export const updateNote = (note, isInTrans) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        if (isInTrans) {
            let updatingNote = realm.objectForPrimaryKey(NOTE_SCHEMA, note.id);
            updatingNote.name = note.name;
            updatingNote.time = note.time;
            updatingNote.noteType = note.noteType;
            updatingNote.noteContent = note.noteContent;
            resolve();
        } else {
            realm.write(() => {
                let updatingNote = realm.objectForPrimaryKey(NOTE_SCHEMA, note.id);
                updatingNote.name = note.name;
                updatingNote.time = note.time;
                updatingNote.noteType = note.noteType;
                updatingNote.noteContent = note.noteContent;
                resolve();
            })
        }

    }).catch((error) => reject(error));
});

export const deleteNote = (noteId, isInTrans) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        if (isInTrans) {
            let deletingNote = realm.objectForPrimaryKey(AUDIO_SCHEMA, noteId);
            realm.delete(deletingNote);
            resolve();
        } else {
            realm.write(() => {
                let deletingNote = realm.objectForPrimaryKey(AUDIO_SCHEMA, noteId);
                realm.delete(deletingNote);
                resolve();
            })
        }
    }).catch((error) => reject(error));
});

export const insertAudio = (newAudio, isInTrans) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        if (isInTrans) {
            realm.create(AUDIO_SCHEMA, newAudio);
            resolve(newAudio);
        } else {
            realm.write(() => {
                realm.create(AUDIO_SCHEMA, newAudio);
                resolve(newAudio);
            });
        }

        console.log('audio数据库存在', realm.path);
    }).catch((error) => reject(error));
});

export const deleteAudio = (audioId, isInTrans) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        if (isInTrans) {
            let deletingAudio = realm.objectForPrimaryKey(AUDIO_SCHEMA, audioId);
            console.log('删除', deletingAudio);
            realm.delete(deletingAudio);
            resolve();
        } else {
            realm.write(() => {
                let deletingAudio = realm.objectForPrimaryKey(AUDIO_SCHEMA, audioId);
                console.log('删除', deletingAudio);
                realm.delete(deletingAudio);
                resolve();
            })
        }

    }).catch((error) => reject(error));
});

export const queryNotes = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        rememberAllRealm = realm;
        let allNotes = realm.objects(NOTE_SCHEMA);
        resolve(allNotes);

    }).catch((error) => {
        reject(error);
    });
});





export const beginTrans = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        if (! realm.isInTransaction) {
            realm.beginTransaction()
        }
    }).catch((error) => {
        reject(error);
    });
});

export const cancelTrans = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.cancelTransaction()

    }).catch((error) => {
        reject(error);
    });
});

export const commitTrans = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.commitTransaction()

    }).catch((error) => {
        reject(error);
    });
});


