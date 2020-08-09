"use babel";

class Settings {
  /*
   *
   */
  constructor() {
    // fontFamily
    inkdrop.config.observe("editor.fontFamily", (newValue) => {
      this.fontFamily = newValue;
    });
    // noteId
    inkdrop.config.observe("vtab.noteId", (newValue) => {
      console.log(`vtab:noteId=${newValue}`);
      if (newValue == null) {
        newValue = "";
      }
      this.noteId = newValue;
    });
  }
}

export default new Settings();
