import Realm from 'realm';

const NOTE_SCHEMA = "NoteList";
const AUDIO_SCHEMA = "AudioList";

export const NoteSchema = {
    name: NOTE_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        noteType: 'string',
        noteContent: 'string',
    }
};

export const AudioSchema = {
    name: AUDIO_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
    }
};

const databaseOptions = {
    path: 'rememberAll.realm',
    schema: [NoteSchema, AudioSchema]
};

export const insertNote = newNote => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(NOTE_SCHEMA, newNote);
            resolve(newNote);
        });
    }).catch((error) => reject(error));
});

export const updateNote = note => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let updatingNote = realm.objectForPrimaryKey(NOTE_SCHEMA, note.id);
            updatingNote.noteType = note.noteType;
            updatingNote.noteContent = note.noteContent;
            resolve();
        })
    }).catch((error) => reject(error));
});

export const deleteNote = noteId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingNote = realm.objectForPrimaryKey(NOTE_SCHEMA, noteId);
            realm.delete(deletingNote);
            resolve();
        })
    }).catch((error) => reject(error));
});