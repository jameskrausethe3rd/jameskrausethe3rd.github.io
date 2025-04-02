import { Component, Input, OnInit } from '@angular/core';
import { CommandService } from '../services/command.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-output-component',
  templateUrl: './output-component.component.html',
  styleUrls: ['./output-component.component.css']
})
export class OutputComponentComponent implements OnInit {
  @Input() enteredCommand!: string;
  public commandResponse!: SafeHtml;

  constructor(private commandService: CommandService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const rawResponse = this.commandService.getResponse(this.enteredCommand);
    this.commandResponse = this.sanitizer.bypassSecurityTrustHtml(rawResponse);
  }
}
