import { Injectable } from '@angular/core';
import * as commands from 'src/assets/commands.json';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  command!: string;

  constructor(private fileService: FileService) {}

  getResponse(enteredCommand: string): string {
    this.command = enteredCommand;
    const splitCommand = this.command.split(" ");
    if (commands[splitCommand[0] as keyof typeof commands] !== undefined) {
      return this.parseCommand(splitCommand);
    } else {
      if (this.command === "") {
        return `\n`;
      } else {
        return `bash: ${enteredCommand}: command not found. Type "help" for available commands.\n\n`;
      }
    }
  }

  parseCommand(unparsedCommand: string[]): string {
    switch(unparsedCommand[0]) {
      case "cat":
        return this.executeCat(unparsedCommand);
      case "ls":
        return this.executeLS(unparsedCommand);
      default:
        return this.executePredefinedTextCommand(unparsedCommand);
    }
  }

  executeCat(catCommand: string[]): string {
    if (catCommand.length === 1) {
      return `${catCommand[0]}: missing file operand\n\n`;
    }

    if (catCommand.length > 2) {
      return `${catCommand[0]}: too many arguments}\n\n`;
    }

    const fileName = catCommand[1];
    const file = this.fileService.getFile(fileName);

    if (!file) {
      return `cat: ${fileName}: No such file or directory\n\n`;
    } else {
      return this.fileService.getFileContent(file) + "\n";
    }
  }

  executeLS(lsCommand: string[]): string {
    if (lsCommand.length > 1) {
      return `${lsCommand[0]}: unexpected argument - ${lsCommand[1]}\n`;
    } else {
      const files = this.fileService.getFiles();
      let output = "";
      for (const file of files) {
        output += file.name + "\n";
      }
      return output + "\n";
    }
  }

  executePredefinedTextCommand(predefinedTextCommand: string[]): string {
    if (predefinedTextCommand.length > 1) {
      return `${predefinedTextCommand[0]}: unexpected argument - ${predefinedTextCommand[1]}\n`;
    } else {
      const predefinedTextCommandOutput = commands[predefinedTextCommand[0] as keyof typeof commands];
      return this.formatPredefinedTextCommand(predefinedTextCommandOutput);
    }
  }

  formatPredefinedTextCommand(textArray: any[]): string {
    let output = "";

    for (const str of textArray) {
      if (Array.isArray(str)) {
        output += this.formatPredefinedTextCommand(str) + "\n";
      } else {
        output += (str + "\n");
      }
    }

    return output;
  }

  getCommands(): string[] {
    return Object.keys(commands).filter(command => command !== "commands" && command !== "predefinedTextCommands");
  }
}
