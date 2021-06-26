import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Document } from 'src/app/models/document.model';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  document: Document;
  private _docSub: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this._docSub = this.documentService.currentDoc
    .pipe( startWith({id: '', doc: 'Select an existing document or create a new one to get started'}) )
    .subscribe(doc => this.document = doc);
  }
  ngOnDestroy(){
    this._docSub.unsubscribe();
  }

  editDoc(){
    if (this.document.id != ""){
      this.documentService.editDoc(this.document);
    }
    
  }

}
