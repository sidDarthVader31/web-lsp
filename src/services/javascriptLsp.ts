import { ILspService } from "./lspService";
import { _Connection, createConnection, ProposedFeatures, TextDocuments, InitializeParams, InitializeResult, TextDocumentSyncKind, DidChangeConfigurationNotification, TextDocumentPositionParams, CompletionItem, CompletionItemKind, InsertTextFormat} from "vscode-languageserver/node";
import { TextDocument } from 'vscode-languageserver-textdocument';
export class JavascriptLsp implements ILspService {
  private server: _Connection;
  private documents : TextDocuments<TextDocument>;
  private hasConfigurationCapability: boolean = false;
  private hasWorkspaceFolderCapability: boolean = false;
  private hasDiagnosticRelatedInformationCapability: boolean = false;
  constructor(){
    this.server = createConnection(ProposedFeatures.all)
    this.documents = new TextDocuments(TextDocument);
    this.init();
  }

  public start(): void {
    this.server.onInitialized(()=>{
      if(this.hasConfigurationCapability){
        this.server.client.register(DidChangeConfigurationNotification.type, undefined)
      }
      if(this.hasWorkspaceFolderCapability){
      }
    })
  }
  public listen(): void {
    this.documents.listen(this.server)
    this.server.listen()
  }
  public translate(input: string): string {
    return input
  }

  private init(){
    this.server.onInitialize((params: InitializeParams) =>{
      console.log(`language server initialized`)
      return {
        capabilities: {
          textDocumentSync: TextDocumentSyncKind.Incremental,
          //enable completion functionality
          completionProvider:{
            resolveProvider: true,
            triggerCharacters:['.','(']
          }
        }
      }
    });
    this.server.onCompletion((params: TextDocumentPositionParams): CompletionItem[] =>{
      return this.getCompletions(params)
    })
     // Handle completion item resolution
    this.server.onCompletionResolve(
      (item: CompletionItem): CompletionItem => {
        return item;
      }
    );
  }
 private getCompletions(params: TextDocumentPositionParams): CompletionItem[] {
    const document = this.documents.get(params.textDocument.uri);
    if(!document){
      return []
    }
    // Get text at current line
    const text = document.getText();
    const lines = text.split('\n');
    const line = lines[params.position.line];
    const prefix = line.slice(0, params.position.character);

    // Add context-aware completions based on the prefix

    // If typing after a dot, suggest methods/properties
    if (prefix.endsWith('.')) {
      const objectMethods = [
        {
          label: 'length',
          kind: CompletionItemKind.Property,
          detail: 'Get length of array/string'
        },
        {
          label: 'map',
          kind: CompletionItemKind.Method,
          detail: 'Array map method',
          insertText: 'map(${1:item} => ${2:expression})',
        },
        {
          label: 'filter',
          kind: CompletionItemKind.Method,
          detail: 'Array filter method',
          insertText: 'filter(${1:item} => ${2:condition})',
        }
      ];
      return objectMethods
    }
    return []
  }
}
