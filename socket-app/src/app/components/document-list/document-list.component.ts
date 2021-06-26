import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Observable<string[]>;
  currDocID: string;
  private _docSub: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documents = this.documentService.documents;
    this._docSub = this.documentService.currentDoc.subscribe(doc => this.currDocID = doc.id);
  }
  ngOnDestroy(){
    this._docSub.unsubscribe();
  }

  loadDoc(docId: string){
    this.documentService.getDoc(docId);
  }

  newDoc(){
    this.documentService.newDoc();
  }

}
