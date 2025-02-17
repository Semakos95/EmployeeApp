import { Component } from '@angular/core';
import { AttributeService } from '../../services/attribute.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [CommonModule, MatCardModule , FormComponent],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.css'
})
export class AttributesComponent {
  attributes:any[] = []

  attrObject:any = null;

  constructor(private atrService: AttributeService,private dialog: MatDialog){

  }

  ngOnInit(){
    this.atrService.attributeContainer.subscribe(data=>{
      this.attributes = data;
    })
  }

  onEditAttr(attr:any){
    this.attrObject = attr
  }

  onDeleteAttr(attr:any){
    let dialogRef = this.dialog.open(DialogComponent);
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

  onPressX(e:MouseEvent){
    this.attrObject = null;
  }

  closeAttrModal(){
    this.attrObject = null;
  }

}
