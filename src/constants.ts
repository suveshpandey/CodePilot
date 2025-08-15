export const codeSnippets: Record<string, string> = {
    c: `#include <stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,

    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,

    javascript: `// Your JavaScript code starts here
console.log("Hello, World!");
`,

    typescript: `// Your TypeScript code starts here
function greet(name: string): void {
    console.log(\`Hello, \${name}!\`);
}

greet("World");
`,

    python: `# Your Python code starts here
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
`,

    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`
};

export const LANGUAGE_VERSION: Record<string, string> = {
    c: "10.2.0",
    cpp: "10.2.0",
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
};
export const LANGUAGE_EXTENSIONS: Record<string, string> = {
    c: "c",
    cpp: "cpp",
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
}