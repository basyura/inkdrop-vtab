"use babel";

import * as React from "react";
import { CompositeDisposable } from "event-kit";

export default class VtabMessageDialog extends React.Component {
  componentWillMount() {
    // Events subscribed to in Inkdrop's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  render() {
    return (
      <div class="vtab">
        <button class="vtab_tab">tab1</button>
        <button class="vtab_tab">tab2</button>
        <button class="vtab_tab">tab3</button>
      </div>
    );
  }

  toggle() {
    console.log("Vtab was toggled!");
    const { dialog } = this.refs;
    if (!dialog.isShown) {
      dialog.showDialog();
    } else {
      dialog.dismissDialog();
    }
  }
}
