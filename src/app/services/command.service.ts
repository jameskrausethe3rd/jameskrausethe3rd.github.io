import { Injectable } from '@angular/core';
import * as commands from 'src/assets/commands.json';

@Injectable({
  providedIn: 'root',
})
export class CommandService {

  getResponse(command: string): string {
    const resolvedCommand = commands[command as keyof typeof commands];
    if (undefined == resolvedCommand) {
      return `bash: ${command}: command not found. Type "help" for available commands.\n\n`;
    } else {
      return resolvedCommand + "\n\n";
    }
  }
}
