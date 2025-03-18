import * as vscode from "vscode";

export interface HideableElement {
  range: vscode.Range;
  type: "type" | "scope";
}

export function findHideableElements(
  document: vscode.TextDocument
): HideableElement[] {
  const text = document.getText();
  const elements: HideableElement[] = [];

  // Find type declarations
  findTypes(text, document, elements);

  // Find scope elements (braces, etc)
  findScopes(text, document, elements);

  return elements;
}

function findTypes(
  text: string,
  document: vscode.TextDocument,
  elements: HideableElement[]
): void {
  // This is a simplified regex for Java types - would need more sophistication for a real implementation
  const typeRegex =
    /\b([A-Z][a-zA-Z0-9_]*(<.*?>)?)\s+([a-z][a-zA-Z0-9_]*)\s*(?:=|;|\))/g;
  let match;

  while ((match = typeRegex.exec(text))) {
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[1].length);

    elements.push({
      range: new vscode.Range(start, end),
      type: "type",
    });
  }
}

function findScopes(
  text: string,
  document: vscode.TextDocument,
  elements: HideableElement[]
): void {
  // Looking for opening/closing braces of methods and classes
  // This is a simplified approach - a real parser would be more robust
  const scopeRegex = /\{|\}/g;
  let match;

  while ((match = scopeRegex.exec(text))) {
    // We'd need more context to determine if this is actually a scope boundary
    // For now, just marking braces as potentially hideable
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + 1);

    elements.push({
      range: new vscode.Range(start, end),
      type: "scope",
    });
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
