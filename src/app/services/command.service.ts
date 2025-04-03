import { Injectable } from '@angular/core';
import * as commands from 'src/assets/commands.json';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root',
})
export class CommandService {
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
      default:
        return this.executePredefinedTextCommand(unparsedCommand);
    }
  }

  executeCat(catCommand: string[]): any[] {
    const output = [];

    if (catCommand.length === 1) {
      output.push([`${catCommand[0]}: missing file operand`]);
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
    return Object.keys(commands).filter(command => command !== "commands" && command !== "predefinedTextCommands");
  }
}
