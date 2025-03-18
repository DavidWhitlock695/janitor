export function extractAnnotations(javaCode: string): string[] {
    const annotationRegex = /@\w+(\s*\(.*?\))?/g;
    return javaCode.match(annotationRegex) || [];
}

export function removeAnnotations(javaCode: string): string {
    return javaCode.replace(/@\w+(\s*\(.*?\))?/g, '');
}

export function hasAnnotations(javaCode: string): boolean {
    return /@\w+(\s*\(.*?\))?/.test(javaCode);
}