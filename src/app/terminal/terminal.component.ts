import { Component, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import Typed from 'typed.js';
import { FileService } from '../services/file.service';
import { CommandService } from '../services/command.service';
import { BUILD_DATE } from 'src/assets/build-date';

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
  buildDate = new Date(BUILD_DATE).toLocaleString();

  // Index for where in the entered commands the user is
  historyIndex: number = -1;

  // Index for where in the possible commands the user is
  tabAutocompleteIndex: number = 0;

  // Value of the text box before the user pressed up/down/tab
  partialEnteredCommand: string = "";
  
  // All commands that were entered
  allEnteredCommands: string[] = [];

  // Distinct list of commands entered so duplicates aren't next to each other
  distinctEnteredCommands: string[] = [];
  
  // List of commands that can be used in tab auto-complete
  possibleCommands: string[] = [];

  // Ascii art message that is displayed on laod
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
\`build date: ${this.buildDate}\`
\`
`,
  ];

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
    const randTime = this.getRandomNumber(500, 2000);

    setTimeout(() => {
      this.showInitializing = false;
    }, randTime);
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
    // Get the value of the input no matter what and enter it
    if (event.key === 'Enter') {
      const command = this.typedInput.nativeElement.value;
      this.allEnteredCommands.push(command);

      if (this.distinctEnteredCommands[this.distinctEnteredCommands.length - 1] !== command) {
        this.distinctEnteredCommands.push(command);
        this.historyIndex = this.distinctEnteredCommands.length;
      }

      this.clearInputValue();
    }

    // Tab autocomplete
    else if (event.key === 'Tab') {
      event.preventDefault();
      const words = this.partialEnteredCommand.split(" ");
      const currentCommand = words[0];

      if (currentCommand) {
        let matchingCommands: string[] = [];

        if (words.length === 1) {
          matchingCommands = this.possibleCommands.filter(cmd => cmd.startsWith(this.partialEnteredCommand));
  
          if (matchingCommands.length > 0) {
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

    // Update partially entered command with the current value of the input
    else if (event.key === 'Backspace') {
      setTimeout(() => {
        this.partialEnteredCommand = this.typedInput.nativeElement.value;
        this.tabAutocompleteIndex = 0;
      }, 0);
    }

    // Go up in the distinctEnteredCommands list
    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.distinctEnteredCommands.length > 0 && this.historyIndex > 0) {
        this.historyIndex -= 1;
        this.setInputValue(this.distinctEnteredCommands[this.historyIndex]);
        this.partialEnteredCommand =this.distinctEnteredCommands[this.historyIndex];
      }
    }

    // Go down in the distinctEnteredCommands list
    else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.distinctEnteredCommands.length > 0 && this.historyIndex !== -1 && this.historyIndex < this.distinctEnteredCommands.length - 1) {
        this.historyIndex += 1;
        this.setInputValue(this.distinctEnteredCommands[this.historyIndex]);
      } else {
        this.historyIndex = this.distinctEnteredCommands.length;
        this.clearInputValue();
      }
    }

    // Update partial entered command and tabAutoCompleteIndex whenever anything else is entered
    else {
      setTimeout(() => {
        this.tabAutocompleteIndex = 0;
        this.partialEnteredCommand = this.typedInput.nativeElement.value;
      }, 0);
    }
  }

  private tabAutoCompleteCat() {
    const files = this.fileService.getFileNames();
    const currentWord = this.partialEnteredCommand.split(" ").pop() || '';
    const matchingCommands = files.filter(cmd => cmd.startsWith(currentWord));

    if (matchingCommands.length) {
      this.tabAutocompleteIndex %= matchingCommands.length;
      this.setInputValue(`cat ${matchingCommands[this.tabAutocompleteIndex++]}`);
    }
  }

  private setInputValue(value: string) {
    this.typedInput.nativeElement.value = value;

  }

  private clearInputValue() {
    this.typedInput.nativeElement.value = '';
    this.partialEnteredCommand = '';
    this.tabAutocompleteIndex = 0;
  }

  public getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  @HostListener('document:click', ['$event'])
  preventClick(event: MouseEvent) {
    event.preventDefault();
  }
}
