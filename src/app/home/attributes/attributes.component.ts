import { Component, ElementRef, ViewChild } from '@angular/core';
import { AttributeService } from '../../services/attribute.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attribute } from '../../models/models';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [CommonModule, MatCardModule , FormComponent],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.css'
})
export class AttributesComponent {
  attributes:Attribute[] = []
  @ViewChild('modalContainer') modalContainer!: ElementRef;
  attrObject:any = null;

  constructor(private atrService: AttributeService,private dialog: MatDialog){

  }

  ngOnInit(){
    this.atrService.attributeContainer.subscribe(data=>{
      this.attributes = data;
    })
  }

  onEditAttr(attr: Attribute){
    this.attrObject = attr;
  }

  onDeleteAttr(attr: Attribute){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete that attribute?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        singleButton: false
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.atrService.deleteAttribute(attr);
      } else {
        console.log('Deletion cancelled.');
      }
    });
  }

  onAddAttr(){
    this.attrObject = true;
  }

  onPressX(e: MouseEvent){
    this.attrObject = null;
  }

  closeAttrModal(){
    this.attrObject = null;
  }

}
