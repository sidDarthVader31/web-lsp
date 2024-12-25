import { ILspService } from "./lspService";
import { createConnection, ProposedFeatures, TextDocuments} from "vscode-languageserver/node";
import { TextDocument } from 'vscode-languageserver-textdocument';
export class JavascriptLsp implements ILspService {
  private server: any;
  private documents : TextDocuments<TextDocuments>;
  constructor(){
    this.server = createConnection(ProposedFeatures.all)
    this.documents = new TextDocuments(TextDocument)
  }

  public start(): void { 
  }
  public listen(): void {

  }
  public translate(input: string): string {
    return input
  }
} 
