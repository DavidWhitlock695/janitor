import * as vscode from "vscode";

export interface HideableElement {
  range: vscode.Range;
  type: "modifier" | "type";
}

export function findHideableElements(
  document: vscode.TextDocument
): HideableElement[] {
  const text = document.getText();
  const elements: HideableElement[] = [];

  // Find fields, methods, and parameters - but not scope elements
  findJavaElements(text, document, elements);

  return elements;
}

function findJavaElements(
  text: string,
  document: vscode.TextDocument,
  elements: HideableElement[]
): void {
  // 1. Find field declarations
  // Example: private final String name;
  const fieldRegex =
    /\b((?:public|private|protected|static|final|abstract|transient|volatile|synchronized)*)\s+([A-Za-z][\w\.<>\[\]]*)\s+([a-z][\w]*)\s*(?:=|;)/g;
  let match;

  while ((match = fieldRegex.exec(text))) {
    const modifiers = match[1].trim();
    const type = match[2].trim();

    if (modifiers.length > 0) {
      // Hide modifiers (public, private, etc.)
      elements.push({
        range: new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + modifiers.length)
        ),
        type: "modifier",
      });
    }

    // Hide the type (String, int, etc.)
    const typeStart =
      match.index + (modifiers.length > 0 ? modifiers.length + 1 : 0);
    elements.push({
      range: new vscode.Range(
        document.positionAt(typeStart),
        document.positionAt(typeStart + type.length)
      ),
      type: "type",
    });
  }

  // 2. Find method declarations
  // Example: public void setName(String name)
  const methodRegex =
    /\b((?:public|private|protected|static|final|abstract|synchronized)*)\s+([A-Za-z][\w\.<>\[\]]*)\s+([a-z][\w]*)\s*\(([^)]*)\)/g;

  while ((match = methodRegex.exec(text))) {
    const modifiers = match[1].trim();
    const returnType = match[2].trim();
    const parameters = match[4];

    if (modifiers.length > 0) {
      // Hide modifiers
      elements.push({
        range: new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + modifiers.length)
        ),
        type: "modifier",
      });
    }

    // Hide return type
    const typeStart =
      match.index + (modifiers.length > 0 ? modifiers.length + 1 : 0);
    elements.push({
      range: new vscode.Range(
        document.positionAt(typeStart),
        document.positionAt(typeStart + returnType.length)
      ),
      type: "type",
    });

    // Process parameters
    if (parameters.trim().length > 0) {
      const paramList = parameters.split(",");
      let paramOffset = match.index + match[0].indexOf("(") + 1;

      for (const param of paramList) {
        const paramParts = param
          .trim()
          .match(/\s*(?:final\s+)?([A-Za-z][\w\.<>\[\]]*)\s+([a-z][\w]*)\s*/);
        if (paramParts) {
          const paramType = paramParts[1];
          const paramTypeStart = param.indexOf(paramType);
          elements.push({
            range: new vscode.Range(
              document.positionAt(paramOffset + paramTypeStart),
              document.positionAt(
                paramOffset + paramTypeStart + paramType.length
              )
            ),
            type: "type",
          });

          // If there's a 'final' keyword
          if (param.trim().startsWith("final")) {
            elements.push({
              range: new vscode.Range(
                document.positionAt(paramOffset),
                document.positionAt(paramOffset + 5) // "final".length
              ),
              type: "modifier",
            });
          }
        }
        paramOffset += param.length + 1; // +1 for comma
      }
    }
  }

  // 3. Find constructor declarations
  const constructorRegex =
    /\b((?:public|private|protected)*)\s+([A-Z][\w]*)\s*\(([^)]*)\)/g;

  while ((match = constructorRegex.exec(text))) {
    const modifiers = match[1].trim();
    const parameters = match[3];

    if (modifiers.length > 0) {
      // Hide modifiers
      elements.push({
        range: new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + modifiers.length)
        ),
        type: "modifier",
      });
    }

    // Process parameters (same as for methods)
    if (parameters.trim().length > 0) {
      const paramList = parameters.split(",");
      let paramOffset = match.index + match[0].indexOf("(") + 1;

      for (const param of paramList) {
        const paramParts = param
          .trim()
          .match(/\s*(?:final\s+)?([A-Za-z][\w\.<>\[\]]*)\s+([a-z][\w]*)\s*/);
        if (paramParts) {
          const paramType = paramParts[1];
          const paramTypeStart = param.indexOf(paramType);
          elements.push({
            range: new vscode.Range(
              document.positionAt(paramOffset + paramTypeStart),
              document.positionAt(
                paramOffset + paramTypeStart + paramType.length
              )
            ),
            type: "type",
          });

          // If there's a 'final' keyword
          if (param.trim().startsWith("final")) {
            elements.push({
              range: new vscode.Range(
                document.positionAt(paramOffset),
                document.positionAt(paramOffset + 5)
              ),
              type: "modifier",
            });
          }
        }
        paramOffset += param.length + 1; // +1 for comma
      }
    }
  }
}

export function extractAnnotations(javaCode: string): string[] {
  const annotationRegex = /@\w+(\s*\(.*?\))?/g;
  return javaCode.match(annotationRegex) || [];
}

export function removeAnnotations(javaCode: string): string {
  return javaCode.replace(/@\w+(\s*\(.*?\))?/g, "");
}

export function hasAnnotations(javaCode: string): boolean {
  return /@\w+(\s*\(.*?\))?/.test(javaCode);
}
