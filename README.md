# janitor

VSCode plugin to hide all the Java annotations I don't want to see all the time.

# Overview

Java has loads of boilerplate and I want to focus on two of them:

1. types (e.g. String, int...)
2. scopes (e.g. private, public...)

While I don't want these features to be hidden, the ability to quickly hide them from view to read the code more easily would be nice.

# Features

- Toggle visibility of Java annotations with a button or shortcut.
- Easy integration with existing Java projects in VS Code.
- Customizable settings to define which annotations to hide.

# Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Open the project in VS Code.
3. Install dependencies:
   ```
   npm install
   ```
4. Run the extension in the Extension Development Host.

# Usage

- Use the command palette (Ctrl+Shift+P) and search for "Toggle Annotations" to hide or show annotations in your Java files.
- You can also set a keyboard shortcut for quick access.

# The project

To build a VS Code plugin that can hide them with a button/shortcut.

# To install

Opening VS Code
Going to the Extensions view (Ctrl+Shift+X or ⌘+Shift+X on Mac)
Clicking on the "..." (More Actions) at the top of the Extensions panel
Selecting "Install from VSIX..."
Browsing to and selecting your .vsix file
