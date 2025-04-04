import { Injectable } from '@angular/core';
import * as commands from 'src/assets/commands.json';
import { FileService } from './file.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  private clearTerminalSubject = new Subject<void>();
  clearTerminal$ = this.clearTerminalSubject.asObservable();
  command!: string;

  constructor(private fileService: FileService) {}

  getResponse(enteredCommand: string): any[] {
    this.command = enteredCommand;
    const splitCommand = this.command.split(" ");
    if (commands[splitCommand[0] as keyof typeof commands] !== undefined) {
      return this.parseCommand(splitCommand);
    } else {
      if (this.command === "") {
        return [];
      } else {
        return [[`bash: ${enteredCommand}: command not found. Type "help" for available commands.`]];
      }
    }
  }

  parseCommand(unparsedCommand: string[]): any[] {
    switch(unparsedCommand[0]) {
      case "cat":
        return this.executeCat(unparsedCommand);
      case "ls":
        return this.executeLS(unparsedCommand);
      case "cls":
        return this.executeCLS(unparsedCommand);
      case "color":
        return this.executeColor(unparsedCommand);
      default:
        return this.executePredefinedTextCommand(unparsedCommand);
    }
  }

  executeCat(catCommand: string[]): any[] {
    const output = [];

    if (catCommand.length === 1) {
      output.push([`${catCommand[0]}: missing file parameter`]);
      return output;
    }

    if (catCommand.length > 2) {
      output.push([`${catCommand[0]}: too many arguments`]);
      return output;
    }

    const fileName = catCommand[1];
    const file = this.fileService.getFile(fileName);

    if (!file) {
      output.push([`cat: ${fileName}: No such file or directory`]);
      return output;
    } else {
      output.push([this.fileService.getFileContent(file)]);
      return output;
    }
  }

  executeCLS(clsCommand: string[]): any[] {
    const output = [];

    if (clsCommand.length > 1) {
      output.push([`${clsCommand[0]}: unexpected argument - ${clsCommand[1]}`]);
      return output;
    } 
    
    this.clearTerminal();
    return[];
  }

  executeColor(colorCommand: string[]): any[] {
    const output = [];

    if (colorCommand.length === 1) {
      output.push([`${colorCommand[0]}: missing color parameter`]);
      return output;
    }

    if (colorCommand.length > 2) {
      output.push([`${colorCommand[0]}: too many arguments`])
      return output;
    }

    if ("--reset" === colorCommand[1]) {
      this.updateTerminalColor("#41ff00");
      return [];
    }

    if ("--help" === colorCommand[1]) {
      return this.executePredefinedTextCommand([colorCommand.join(' ')]);
    }

    if (!this.isValidCssColor(colorCommand[1])) {
      output.push([`bash: ${colorCommand[1]}: invalid color`]);
      return output;
    }

    const color = colorCommand[1].toLowerCase();
    this.updateTerminalColor(color);
    return [];
  }

  executeLS(lsCommand: string[]): any[] {
    const output = [];

    if (lsCommand.length > 1) {
      output.push([`${lsCommand[0]}: unexpected argument - ${lsCommand[1]}`]);
      return output;
    } else {
      const files = this.fileService.getFiles();
      let fileList = []

      for (const file of files) {
        fileList.push(file.name);
      }

      output.push(fileList);
      return output;
    }
  }

  executePredefinedTextCommand(predefinedTextCommand: string[]): any[] {
    if (predefinedTextCommand.length > 1) {
      return [`${predefinedTextCommand[0]}: unexpected argument - ${predefinedTextCommand[1]}\n`];
    } else {
      const predefinedTextCommandOutput = commands[predefinedTextCommand[0] as keyof typeof commands];
      return predefinedTextCommandOutput;
    }
  }

  getCommands(): string[] {
    return Object.keys(commands).filter(command => command !== "commands" && command !== "predefinedTextCommands" && command.indexOf("--help") === -1);
  }

  clearTerminal(): void {
    this.clearTerminalSubject.next();
  }

  updateTerminalColor(color: string): void {
    document.documentElement.style.setProperty('--font-color', color);
    document.documentElement.style.setProperty('--secondary-color', color);
  }

  isValidCssColor(color: string): boolean {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  }
}
