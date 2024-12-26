import { LANGUAGE } from "../background/background";
import { JavascriptLSP } from "./javascriptLsp";

export interface ILspService {
  start():void;
  listen():void;
  translate(input: string): string;
}



export class LspService implements ILspService {
  private readonly service: ILspService;
  constructor(language: LANGUAGE) {
    switch(language){
      case LANGUAGE.JAVASCRIPT:
      this.service = new JavascriptLSP();
      default:
      throw new Error("Invalid lsp type")
    }
  }
  public start(): void {
      return this.service.start();
  }
  public listen(): void {
      return this.service.listen();
  }
  public translate(input: string): string {
      return this.service.translate(input)
  }
}



