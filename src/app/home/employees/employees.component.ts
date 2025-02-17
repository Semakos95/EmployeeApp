import { Component, Input } from '@angular/core';
import { Employee } from '../../models/models';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../services/employee.service';
import { Subscription, } from 'rxjs';
import { FormComponent } from '../form/form.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
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
  
  employeeObject:any = null; 

  constructor(private employeeService:EmployeeService, private dialog: MatDialog){

  }

  ngOnInit(){
    this.employeeSubscription = this.employeeService.employeesContainer.subscribe(data=>{
      this.employees=data;
    })
  }


  onEditEmp(emp: any) {
    console.log('Selected Employee:', emp);
    this.employeeObject = emp;
  }

  onDeleteEmp(emp:any){
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.employeeService.deleteEmployee(emp);
      } else {
        console.log('Deletion cancelled.');
      }
    });
  }

  onAddEmp(){
    this.employeeObject = true;
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
}
