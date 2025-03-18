import * as assert from "assert";
import * as vscode from "vscode";
import AnnotationProvider from "../../annotationProvider";

suite("AnnotationProvider Tests", () => {
  let annotationProvider: AnnotationProvider;

  setup(() => {
    annotationProvider = new AnnotationProvider();
  });

  test("should hide annotations in Java code", async () => {
    const javaCode = `
            @Override
            public void myMethod() {
                // method implementation
            }
        `;
    const expectedOutput = `
            public void myMethod() {
                // method implementation
            }
        `;

    const result = annotationProvider.provideTextDocumentContent(
      vscode.Uri.parse("file:///test.java"),
      javaCode
    );
    assert.strictEqual(result, expectedOutput);
  });

  test("should return original code if no annotations are present", async () => {
    const javaCode = `
            public void myMethod() {
                // method implementation
            }
        `;

    const result = await annotationProvider.provideTextDocumentContent(
      vscode.Uri.parse("file:///test.java"),
      javaCode
    );
    assert.strictEqual(result, javaCode);
  });
});
