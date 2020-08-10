"use babel";

export class Tab {
  constructor(noteId, title) {
    this.noteId = noteId;
    this.title = title;
  }
}

export function newTab(props) {
  const note = props.editingNote;
  if (note == null) {
    return null;
  }
  return new Tab(note._id, note.title);
}
