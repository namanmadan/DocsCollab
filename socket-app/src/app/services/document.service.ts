import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Document } from 'src/app/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  currentDoc = this.socket.fromEvent<Document>("document");
  documents = this.socket.fromEvent<string[]>("documents");

  constructor(private socket: Socket) { }

  getDoc(id: string){
    this.socket.emit("getDoc", id);
  }

  newDoc(){
    let doc = new Document();
    doc.doc = "";
    doc.id = this.generateId();
    this.socket.emit("addDoc", doc);
  }

  editDoc(doc: Document){
    this.socket.emit("editDoc", doc);
  }

  private generateId(): string{
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";

    for (let i = 0; i<5; i++){
      id += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return id;
    
  }
}
