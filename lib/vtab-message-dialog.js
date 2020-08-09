"use babel";
/*
 * TODO
 * - Update tab title if note title changes.
 *
 */
import * as React from "react";
import { CompositeDisposable } from "event-kit";
import { Tab, newTab } from "./tab";
import Settings from "./settings";

export default class VtabMessageDialog extends React.Component {
  /*
   *
   */
  componentWillMount() {
    const { commands } = inkdrop;
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      commands.add(document.body, {
        "vtab:add": this.add,
        "vtab:next": this.next,
        "vtab:prev": this.prev,
      })
    );

    this.selectedIndex = -1;
    this.setState({ tabs: [] });

    (async () => {
      // todo: check setting
      if (Settings.noteId == "") {
        // todo: message
        return;
      }
      const db = inkdrop.main.dataStore.getLocalDB();
      const note = await db.notes.get(Settings.noteId);
      // todo: parse error
      const tabs = JSON.parse(note.body).map((v) => new Tab(v.noteId, v.title));
      this.setState({ tabs: tabs });
    })();
  }
  /*
   *
   */
  componentWillUnmount() {
    this.subscriptions.dispose();
  }
  /*
   *
   */
  render() {
    let tabs = this.state.tabs;
    let cur = newTab(this.props);
    if (cur != null) {
      cur.isCurrent = true;
    }

    const idx = this.state.tabs.findIndex((v) => v.noteId == cur.noteId);
    let pos = 0;

    return (
      <div class="vtab">
        {tabs.map((tab) => {
          pos++;
          return (
            <button
              class="vtab_tab"
              onClick={this.openNote.bind(this, tab)}
              style={this.toStyle(pos, cur, tab)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
    );
  }
  /*
   *
   */
  toStyle = (pos, cur, tab) => {
    let style = { fontFamily: Settings.fontFamily };
    // not current but selected tab
    if (this.selectedIndex >= 0 && cur.noteId != tab.noteId) {
      if (this.state.tabs[this.selectedIndex].noteId == tab.noteId) {
        style.background = "#DEF7FB";
        return style;
      }
    }

    if (cur != null && tab.noteId == cur.noteId) {
      style.background = "#5E81AC";
      style.color = "white";
    }

    return style;
  };
  /*
   *
   */
  openNote = (tab) => {
    inkdrop.commands.dispatch(document.body, "core:open-note", {
      noteId: tab.noteId,
    });

    this.selectedIndex = this.state.tabs.findIndex((v) => v.noteId == tab.noteId);

    this.focusNote();
  };
  /*
   *
   */
  add = () => {
    console.log("add");
    // todo: check
    if (Settings.noteId == "") {
      return;
    }

    console.log(this.props);
    let tabs = this.state.tabs;
    const tab = newTab(this.props);
    const idx = tabs.findIndex((v) => v.noteId == tab.noteId);
    // add or remvoe
    if (idx >= 0) {
      tabs.splice(idx, 1);
      // when selected last tab
      if (this.selectedIndex == tabs.length) {
        this.selectedIndex--;
      }
    } else {
      tabs.push(tab);
    }
    // invoke render
    this.setState({ tabs: tabs });
    // save note
    (async () => {
      const db = inkdrop.main.dataStore.getLocalDB();
      const note = await db.notes.get(Settings.noteId);
      note.body = JSON.stringify(this.state.tabs, null, "  ");
      await db.notes.put(note);
    })();
  };
  /*
   *
   */
  next = () => {
    if (this.selectedIndex > 0) {
      const tab = newTab(this.props);
      const idx = this.state.tabs.findIndex((v) => v.noteId == tab.noteId);
      console.log(`next -> ${idx}, selectedIndex = ${this.selectedIndex}`);
      // don't move if current note is not tab.
      if (idx < 0) {
        this.openNote(this.state.tabs[this.selectedIndex]);
        return;
      }
    }

    this.selectedIndex++;
    if (this.state.tabs.length < this.selectedIndex + 1) {
      this.selectedIndex = 0;
    }
    this.openNote(this.state.tabs[this.selectedIndex]);
  };
  /*
   *
   */
  prev = () => {
    if (this.selectedIndex > 0) {
      const tab = newTab(this.props);
      const idx = this.state.tabs.findIndex((v) => v.noteId == tab.noteId);
      // don't move if current note is not tab.
      if (idx < 0) {
        this.openNote(this.state.tabs[this.selectedIndex]);
        return;
      }
    }
    this.selectedIndex--;
    if (this.selectedIndex < 0) {
      this.selectedIndex = this.state.tabs.length - 1;
    }
    this.openNote(this.state.tabs[this.selectedIndex]);
  };
  /*
   *
   */
  focusNote = () => {
    const editorEle = document.querySelector(".editor");
    if (editorEle != null) {
      const isPreview = editorEle.classList.contains("editor-viewmode-preview");
      if (isPreview) {
        const preview = editorEle.querySelector(".mde-preview");
        preview.focus();
      } else {
        inkdrop.getActiveEditor().cm.focus();
      }
    }
  };
}
