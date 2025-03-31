import { Injectable } from '@angular/core';
import { FileModel } from '../models/file-model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private files: FileModel[] = [];
  private fileIdCounter = 1;

  createFile(name: string, content: string = ''): FileModel {
    const newFile: FileModel = {
      id: this.fileIdCounter++,
      name,
      content,
      lastModified: new Date(),
    };
    this.files.push(newFile);
    return newFile;
  }

  createDefaultFiles() {
    this.createFile('README.md', '# Welcome to the Terminal!\n\nThis is a simple terminal emulator.');
    this.createFile('script.sh', '#!/bin/bash\necho "Hello, World!"');
    this.createFile('index.html', '<!DOCTYPE html>\n<html>\n<head>\n<title>My Page</title>\n</head>\n<body>\n<h1>Hello, World!</h1>\n</body>\n</html>');
    this.createFile('style.css', 'body {\n  background-color: #f0f0f0;\n}');
    this.createFile('todo.txt', `- [ ] Add file creation\n- [ ] Add file deletion\n- [ ] Add file sorting\n- [ ] Add tab autocomplete\n`);
  }

  getFiles(): FileModel[] {
    this.files.sort((a, b) => a.name.localeCompare(b.name));
    this.files.sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime());
    return this.files;
  }

  getFileNames(): string[] {
    this.files.sort((a, b) => a.name.localeCompare(b.name));
    this.files.sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime());
    return this.files.map(file => file.name);
  }

  getFile(fileName: string): FileModel | undefined {
    return this.files.find(file => file.name === fileName);
  }

  getFileContent(file: FileModel): string {
    return file.content;
  }

  updateFile(id: number, newContent: string) {
    const file = this.files.find(f => f.id === id);
    if (file) {
      file.content = newContent;
      file.lastModified = new Date();
    }
  }
}
