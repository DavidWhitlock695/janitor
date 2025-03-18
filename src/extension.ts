import * as vscode from "vscode";
import { findHideableElements } from "./utils/javaParser";

let decorationType: vscode.TextEditorDecorationType;
let hideActive = false;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log("Janitor extension is now active");

  // Create decoration type for hiding
  decorationType = vscode.window.createTextEditorDecorationType({
    opacity: "0",
    textDecoration: "none; display: none",
  });

  // Register the command to toggle
  let disposable = vscode.commands.registerCommand(
    "janitor.hideAnnotations",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === "java") {
        toggleAnnotations(editor);
      } else {
        vscode.window.showInformationMessage(
          "Janitor only works with Java files"
        );
      }
    }
  );

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "janitor.hideAnnotations";
  statusBarItem.text = "$(eye) Java Types";
  statusBarItem.tooltip = "Toggle Java types and modifiers visibility";
  statusBarItem.show();

  context.subscriptions.push(disposable, statusBarItem);

  // Update status when editor changes
  vscode.window.onDidChangeActiveTextEditor(updateStatusBarVisibility);
  updateStatusBarVisibility(vscode.window.activeTextEditor);
}

function toggleAnnotations(editor: vscode.TextEditor) {
  hideActive = !hideActive;

  if (hideActive) {
    applyDecorations(editor);
    statusBarItem.text = "$(eye-closed) Java Types";
    vscode.window.showInformationMessage("Java types and modifiers hidden");
  } else {
    editor.setDecorations(decorationType, []);
    statusBarItem.text = "$(eye) Java Types";
    vscode.window.showInformationMessage("Java types and modifiers visible");
  }
}

function applyDecorations(editor: vscode.TextEditor) {
  const elements = findHideableElements(editor.document);
  const decorations = elements.map((element) => ({
    range: element.range,
  }));

  editor.setDecorations(decorationType, decorations);
}

function updateStatusBarVisibility(editor?: vscode.TextEditor) {
  if (editor && editor.document.languageId === "java") {
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

export function deactivate() {}
