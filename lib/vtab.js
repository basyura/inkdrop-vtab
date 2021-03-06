"use babel";

import VtabMessageDialog from "./vtab-message-dialog";

module.exports = {
  activate() {
    inkdrop.components.registerClass(VtabMessageDialog);
    inkdrop.layouts.addComponentToLayout(
      "editor-status-bar",
      "VtabMessageDialog"
    );
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout("modal", "VtabMessageDialog");
    inkdrop.components.deleteClass(VtabMessageDialog);
  },

  config: {
    noteId: {
      title: "Note id which save tab state (ex. 'note:opQ-gZXdC')",
      type: "string",
      default: "",
    },
  },
};
