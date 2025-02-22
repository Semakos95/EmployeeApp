import { Component, ElementRef, Input, ViewChild, viewChild } from '@angular/core';
import { Employee } from '../../models/models';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../services/employee.service';
import { Subscription, } from 'rxjs';
import { FormComponent } from '../form/form.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AttributeService } from '../../services/attribute.service';
@Component({
  selector: 'app-employees',
  imports: [FormComponent,CommonModule,MatDialogModule],
  standalone: true,
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {
  employees: Employee[] = [];
  private employeeSubscription = new Subscription();
  employeeObject: any = null; 
  attributeExists: boolean = false;


  constructor(private employeeService: EmployeeService,private atrService:AttributeService, private dialog: MatDialog){  }

  ngOnInit(){
    this.employeeSubscription = this.employeeService.getAllEmployees().subscribe(data => {
      this.employees = data;
    })
    this.loadAttributes();
  }


  onEditEmp(emp: any) {
    console.log('Selected Employee:', emp);
    this.employeeObject = emp;
  }

  onDeleteEmp(emp:any){
    // let dialogRef = this.dialog.open(DialogComponent);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete that employee?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        singleButton: false
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.employeeService.deleteEmployee(emp);
      } else {
        console.log('Deletion cancelled.');
      }
    });
  }

  onAddEmp(){
    if (this.attributeExists) {
      this.employeeObject = true;
    } else {
      this.dialog.open(DialogComponent, {
        data: {
          title: 'Warning!',
          message: 'You cannot create a new employee without an existing attribute. Please add an attribute first.',
          confirmButtonText: 'OK',
          singleButton: true
        }
      });
    }
  }
  

  ngOnDestroy(){
    this.employeeSubscription.unsubscribe();
  }

  closeEmployeeModal(){
    this.employeeObject = null;
  }
  onPressX(event:any){
    this.employeeObject = null;
  }

  loadAttributes(){
    this.atrService.getAllAttributes().subscribe(data => {
      // this.attributeOptions = data;
      data.length ? this.attributeExists = true : this.attributeExists = false;
    })
  }
}
