"use babel";
/*
 * TODO
 * - Update tab title if note title changes.
 *
 */

import * as React from "react";
import { CompositeDisposable } from "event-kit";
import { Tab } from "./tab";
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
      })
    );

    this.setState({ tabs: [] });

    (async () => {
      // todo: check setting
      if (Settings.noteId == "") {
        // todo: message
        return;
      }
      const db = inkdrop.main.dataStore.getLocalDB();
      const note = await db.notes.get(Settings.noteId);
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
    return (
      <div class="vtab">
        {this.state.tabs.map((tab) => {
          console.log(tab);
          return (
            <button
              class="vtab_tab"
              onClick={this.openNote.bind(this, tab)}
              style={{ fontFamily: Settings.fontFamily }}
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
  openNote = (tab) => {
    inkdrop.commands.dispatch(document.body, "core:open-note", {
      noteId: tab.noteId,
    });
    this.focusNote();
  };
  /*
   *
   */
  add = () => {
    console.log("add");
    // todo: check
    if (Settings.noteId == "") {
      console.log(`Settings.noteId=${Settings.noteId}`);
      return;
    }

    let tabs = this.state.tabs;
    const note = this.props.editingNote;
    const tab = new Tab(note._id, note.title);
    const idx = tabs.findIndex((v) => v.noteId == tab.noteId);
    if (idx >= 0) {
      tabs.splice(idx, 1);
    } else {
      tabs.push(tab);
    }
    this.setState({ tabs: tabs });

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
