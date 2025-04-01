import { Component, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import Typed from 'typed.js';
import { FileService } from '../services/file.service';
import { CommandService } from '../services/command.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements AfterViewInit {
  @ViewChild('typedInput') typedInput!: ElementRef;
  @ViewChild('inputContainer') inputContainer!: ElementRef;
  @ViewChild('terminalContainer') terminalContainer!: ElementRef;

  constructor(private fileService: FileService, private commandService: CommandService) {}

  showInitializing: boolean = true;
  hidden: boolean = true;
  commandLinePrefix: string = "jameskrause@portfolio:~$";
  historyIndex: number = -1;
  tabAutocompleteIndex: number = 0;
  partialEnteredCommand: string = "";

  welcomeMessage: string[] = [
    `                                         
\` _ _ _     _                      _       \`
\`| | | |___| |___ ___ _____ ___   | |_ ___ \`
\`| | | | -_| |  _| . |     | -_|  |  _| . |\`
\`|_____|___|_|___|___|_|_|_|___|  |_| |___|\`
\`\`
\`          JJJJJJJJJJJ                                                                                    OOOOOOOOO        SSSSSSSSSSSSSSS \`
\`          J:::::::::J                                                                                  OO:::::::::OO    SS:::::::::::::::S\`
\`          J:::::::::J                                                                                OO:::::::::::::OO S:::::SSSSSS::::::S\`
\`          JJ:::::::JJ                                                                               O:::::::OOO:::::::OS:::::S     SSSSSSS\`
\`            J:::::J    aaaaaaaaaaaaa      mmmmmmm    mmmmmmm       eeeeeeeeeeee        ssssssssss   O::::::O   O::::::OS:::::S            \`
\`            J:::::J    a::::::::::::a   mm:::::::m  m:::::::mm   ee::::::::::::ee    ss::::::::::s  O:::::O     O:::::OS:::::S            \`
\`            J:::::J    aaaaaaaaa:::::a m::::::::::mm::::::::::m e::::::eeeee:::::eess:::::::::::::s O:::::O     O:::::O S::::SSSS         \`
\`            J:::::j             a::::a m::::::::::::::::::::::me::::::e     e:::::es::::::ssss:::::sO:::::O     O:::::O  SS::::::SSSSS    \`
\`            J:::::J      aaaaaaa:::::a m:::::mmm::::::mmm:::::me:::::::eeeee::::::e s:::::s  ssssss O:::::O     O:::::O    SSS::::::::SS  \`
\`JJJJJJJ     J:::::J    aa::::::::::::a m::::m   m::::m   m::::me:::::::::::::::::e    s::::::s      O:::::O     O:::::O       SSSSSS::::S \`
\`J:::::J     J:::::J   a::::aaaa::::::a m::::m   m::::m   m::::me::::::eeeeeeeeeee        s::::::s   O:::::O     O:::::O            S:::::S\`
\`J::::::J   J::::::J  a::::a    a:::::a m::::m   m::::m   m::::me:::::::e           ssssss   s:::::s O::::::O   O::::::O            S:::::S\`
\`J:::::::JJJ:::::::J  a::::a    a:::::a m::::m   m::::m   m::::me::::::::e          s:::::ssss::::::sO:::::::OOO:::::::OSSSSSSS     S:::::S\`
\` JJ:::::::::::::JJ   a:::::aaaa::::::a m::::m   m::::m   m::::m e::::::::eeeeeeee  s::::::::::::::s  OO:::::::::::::OO S::::::SSSSSS:::::S\`
\`   JJ:::::::::JJ      a::::::::::aa:::am::::m   m::::m   m::::m  ee:::::::::::::e   s:::::::::::ss     OO:::::::::OO   S:::::::::::::::SS \`
\`     JJJJJJJJJ         aaaaaaaaaa  aaaammmmmm   mmmmmm   mmmmmm    eeeeeeeeeeeeee    sssssssssss         OOOOOOOOO      SSSSSSSSSSSSSSS   \`
\`
\`
`,
  ];

  allEnteredCommands: string[] = [];
  possibleCommands: string[] = [];

  // Initialize Typed.js after view load
  ngAfterViewInit(): void {
    const typedOutput = document.getElementById('typed-output');

    if (typedOutput) {
      let typed = new Typed(typedOutput, {
        strings: this.welcomeMessage,
        startDelay: 0,
        typeSpeed: 0,
        backSpeed: 0,
        fadeOut: false,
        loop: false,
        showCursor: false,
        smartBackspace: false,
        contentType: 'html',
        onComplete: (self) => {
          this.finishWelcomeMessage();
        }
      });
    }

    this.fileService.createDefaultFiles();
    this.possibleCommands = this.commandService.getCommands();
  }

  private finishWelcomeMessage() {
    this.hidden = false;

    setTimeout(() => {
      this.showInitializing = false;
    }, 2000);
  }

  ngAfterViewChecked() {
    const input = this.inputContainer;
    if (input) {
      this.typedInput.nativeElement.focus();
    }

    const container = this.terminalContainer;
    if (container) {
      container.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const command = this.typedInput.nativeElement.value.trim();
      this.allEnteredCommands.push(command);
      this.historyIndex = this.allEnteredCommands.length;
      this.clearInputValue();
    }

    else if (event.key === 'Tab') {
      event.preventDefault();
      const command = this.typedInput.nativeElement.value.trim();
      const words = command.split(" ");
      const currentWord = words[words.length - 1];
      const currentCommand = words[0];

      if (currentCommand) {
        let matchingCommands: string[] = [];

        if (!this.partialEnteredCommand) {
          this.partialEnteredCommand = currentWord;
          this.tabAutocompleteIndex = 0;
        }

        if (words.length === 1) {
          matchingCommands = this.possibleCommands.filter(cmd => cmd.startsWith(this.partialEnteredCommand));
  
          if (matchingCommands.length > 0) {
            // Cycle through matching commands
            if (!this.tabAutocompleteIndex || this.tabAutocompleteIndex >= matchingCommands.length) {
              this.tabAutocompleteIndex = 0;
            }
  
            this.setInputValue(matchingCommands[this.tabAutocompleteIndex]);
            this.tabAutocompleteIndex++;
          }
        } else {
          switch(currentCommand) {
            case "cat":
              this.tabAutoCompleteCat();
              break;
            default:
              break;
          }
        }


      }
    }

    else if (event.key === 'Backspace') {
      setTimeout(() => {
        const command = this.typedInput.nativeElement.value;
        this.partialEnteredCommand = command;
        this.tabAutocompleteIndex = 0;
      }, 0);
    }

    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.allEnteredCommands.length > 0 && this.historyIndex > 0) {
        this.historyIndex -= 1;
        this.setInputValue(this.allEnteredCommands[this.historyIndex]);
      }
    }

    else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.allEnteredCommands.length > 0 && this.historyIndex !== -1 && this.historyIndex < this.allEnteredCommands.length - 1) {
        this.historyIndex += 1;
        this.setInputValue(this.allEnteredCommands[this.historyIndex]);
      } else {
        this.historyIndex = this.allEnteredCommands.length;
        this.clearInputValue();
      }
    }

    else {
      setTimeout(() => {
        this.partialEnteredCommand = this.typedInput.nativeElement.value;
      }, 0);
    }
  }
  private tabAutoCompleteCat() {
    const files = this.fileService.getFileNames();
    const command = this.typedInput.nativeElement.value.trim();
    const words = command.split(" ");
    const currentWord = words[words.length - 1];
    const matchingCommands = files.filter(cmd => cmd.startsWith(currentWord));

    if (matchingCommands.length > 0) {
      // Cycle through matching commands
      if (!this.tabAutocompleteIndex || this.tabAutocompleteIndex >= matchingCommands.length) {
        this.tabAutocompleteIndex = 0;
      }

      this.setInputValue("cat " + matchingCommands[this.tabAutocompleteIndex]);
      this.tabAutocompleteIndex++;
    }
  }

  private setInputValue(value: string) {
    this.typedInput.nativeElement.value = value;

  }

  private clearInputValue() {
    this.typedInput.nativeElement.value = '';
    this.tabAutocompleteIndex = 0;
    this.partialEnteredCommand = '';
  }

  @HostListener('document:click', ['$event'])
  preventClick(event: MouseEvent) {
    event.preventDefault();
  }
}
