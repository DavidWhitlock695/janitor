import * as vscode from "vscode";
import { findHideableElements } from "./utils/javaParser";

let decorationType: vscode.TextEditorDecorationType;
let hideActive = false;

export function activate(context: vscode.ExtensionContext) {
  console.log("Janitor extension is now active");

  // Create decoration type for hiding annotations
  decorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: "none; display: none",
  });

  // Register the command to toggle annotations
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

  context.subscriptions.push(disposable);
}

function toggleAnnotations(editor: vscode.TextEditor) {
  hideActive = !hideActive;

  if (hideActive) {
    applyDecorations(editor);
    vscode.window.showInformationMessage("Java annotations hidden");
  } else {
    editor.setDecorations(decorationType, []);
    vscode.window.showInformationMessage("Java annotations visible");
  }
}

function applyDecorations(editor: vscode.TextEditor) {
  const elements = findHideableElements(editor.document);
  const decorations = elements.map((element) => ({
    range: element.range,
  }));

  editor.setDecorations(decorationType, decorations);
}

export function deactivate() {}
