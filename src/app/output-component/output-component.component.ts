import { Component, Input, OnInit } from '@angular/core';
import { CommandService } from '../services/command.service';

@Component({
  selector: 'app-output-component',
  templateUrl: './output-component.component.html',
  styleUrls: ['./output-component.component.css']
})
export class OutputComponentComponent implements OnInit {
  @Input() enteredCommand!: string;
  public commandResponse!: string;

  constructor(private commandService: CommandService) {}

  ngOnInit(): void {
    this.commandResponse = this.commandService.getResponse(this.enteredCommand);
  }
}
