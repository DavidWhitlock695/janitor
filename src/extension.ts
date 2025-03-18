import * as vscode from "vscode";
import AnnotationProvider from "./annotationProvider";

export function activate(context: vscode.ExtensionContext) {
  const annotationProvider = new AnnotationProvider();
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      "java",
      annotationProvider
    )
  );

  const disposable = vscode.commands.registerCommand(
    "janitor.hideAnnotations",
    () => {
      vscode.window.showInformationMessage("Hiding Java annotations...");
      // Logic to hide annotations can be implemented here
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
