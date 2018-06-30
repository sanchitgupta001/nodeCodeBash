/**
 * Created by sanchitgupta001 on 28/06/18.
 */
const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes');

const titleOptions = {
  describe: 'Title of the note',
  demand: true,
  alias: 't',
};

const bodyOptions = {
  describe: 'Body of the note',
  demand: true,
  alias: 'b',
};

const argv = yargs
  .command('add', 'Add a new note', {
      title: titleOptions,
      body: bodyOptions,
    })
  .command('list', 'List of all notes')
  .command('read', 'Read a note', {
    title: titleOptions,
  })
  .command('remove', 'Remove a note', {
    title: titleOptions,
  })
  .help()
  .argv; // '_' stores the normal arguments; while other arguments like '--title="value"' are stored like key-value pairs
const command = argv._[0];

if (command === 'add') {
  const note = notes.addNote(argv.title, argv.body);
  if (note) {
    console.log('Note Created!');
    notes.logNotes(note);
  } else {
    console.log("Duplicate note title. Please create note with new title");
  }
} else if (command === 'list') {
  const allNotes = notes.getAllNotes();
  const notesLength = allNotes.length;
  if (notesLength > 0) {
    console.log(`Printing ${notesLength} note(s) ...`);
    allNotes.forEach(note => notes.logNotes(note));
  } else {
    console('No Notes added');
  }
} else if (command === 'read') {
  const note = notes.getNote(argv.title);
  if (note) {
    console.log('Note Found');
    notes.logNotes(note);
  } else {
    console.log('Note not found!');
  }
} else if (command === 'remove') {
  const message = notes.removeNote(argv.title) ? 'Note Removed' : 'Note Not Found!';
  console.log(message);

} else {
  console.log("Command Not Found!");
}

