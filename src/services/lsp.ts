
import { spawn } from 'child_process';
import { TextDocument } from 'vscode-languageserver-textdocument';



class TypeScriptLanguageServer {
    private tsServer: any;
    private nextRequestId = 1;
    private callbacks = new Map();

    constructor() {
        // Start the TypeScript language server process
        this.tsServer = spawn('typescript-language-server', ['--stdio']);

        // Handle responses from the TypeScript server
        this.tsServer.stdout.on('data', (data: Buffer) => {
            const responses = data.toString().split('\n').filter(line => line.trim());
            
            for (const response of responses) {
                try {
                    const parsed = JSON.parse(response);
                    if (parsed.id && this.callbacks.has(parsed.id)) {
                        const callback = this.callbacks.get(parsed.id);
                        callback(parsed.result);
                        this.callbacks.delete(parsed.id);
                    }
                } catch (e) {
                    console.error('Failed to parse server response:', e);
                }
            }
        });

        // Initialize the server
        this.initialize();
    }

    private initialize() {
        const initializeRequest = {
            jsonrpc: '2.0',
            id: this.nextRequestId++,
            method: 'initialize',
            params: {
                processId: process.pid,
                rootUri: null,
                capabilities: {}
            }
        };

        this.tsServer.stdin.write(JSON.stringify(initializeRequest) + '\n');
    }

    public async getCompletions(text: string, line: number, character: number): Promise<any> {
        const uri = `file:///temp${Date.now()}.ts`;
        
        // Send document content
        const didOpenRequest = {
            jsonrpc: '2.0',
            method: 'textDocument/didOpen',
            params: {
                textDocument: {
                    uri,
                    languageId: 'typescript',
                    version: 1,
                    text
                }
            }
        };

        this.tsServer.stdin.write(JSON.stringify(didOpenRequest) + '\n');

        // Request completions
        const completionRequest = {
            jsonrpc: '2.0',
            id: this.nextRequestId++,
            method: 'textDocument/completion',
            params: {
                textDocument: { uri },
                position: { line, character }
            }
        };

        return new Promise((resolve) => {
            this.callbacks.set(completionRequest.id, resolve);
            this.tsServer.stdin.write(JSON.stringify(completionRequest) + '\n');
        });
    }
}

// Create a single instance of the language server
const languageServer = new TypeScriptLanguageServer();

console.log(`gettting auto completion::`)


languageServer.getCompletions("conso",0,7).then((data) =>{
  console.log(`data::`, data)
})
.catch(e=>{
  console.log(`error::`, e)
})
