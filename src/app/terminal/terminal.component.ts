import { Component, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import Typed from 'typed.js';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements AfterViewInit {
  @ViewChild('typedInput') typedInput!: ElementRef;
  @ViewChild('inputContainer') inputContainer!: ElementRef;
  @ViewChild('terminalContainer') terminalContainer!: ElementRef;

  constructor(private fileService: FileService) {}

  showInitializing: boolean = true;
  hidden: boolean = true;
  commandLinePrefix: string = "jameskrause@portfolio:~$";
  historyIndex: number = 0;

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

  enteredCommands: string[] = [];

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

    this.fileService.createDefaultFiles()
  }

  private finishWelcomeMessage() {
    this.hidden = false;

    setTimeout(() => {
      this.showInitializing = false;
      this.typedInput.nativeElement.focus();
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
      this.enteredCommands.push(command);
      this.historyIndex = this.enteredCommands.length;
      this.clearInputValue();
    }

    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.enteredCommands.length > 0 && this.historyIndex > 0) {
        this.historyIndex -= 1;
        this.setInputValue(this.enteredCommands[this.historyIndex]);
      }
    }

    else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.enteredCommands.length > 0 && this.historyIndex < this.enteredCommands.length - 1) {
        this.historyIndex += 1;
        this.setInputValue(this.enteredCommands[this.historyIndex]);
      } else {
        this.historyIndex = this.enteredCommands.length;
        this.clearInputValue();
    }
    }
  }

  private setInputValue(value: string) {
    this.typedInput.nativeElement.value = value;

  }

  private clearInputValue() {
    this.typedInput.nativeElement.value = '';
  }

  @HostListener('document:click', ['$event'])
  preventClick(event: MouseEvent) {
    event.preventDefault();
  }
}
