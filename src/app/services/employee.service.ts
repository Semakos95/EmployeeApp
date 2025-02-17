import { Injectable } from "@angular/core";
import { Employee } from "../models/models";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

    public _employeesContainer = new BehaviorSubject<Employee[]>(JSON.parse(localStorage.getItem('employeesArray')||'[]'));
    public employeesContainer = this._employeesContainer.asObservable();

    constructor(){}
    
    //function to delete an employee
    deleteEmployee(employee: any){
        let storedEmployees: Employee[] = JSON.parse(localStorage.getItem('employeesArray') || '[]');

        let updatedEmployees = storedEmployees.filter(emp => emp.id !== employee.id);
        localStorage.setItem('employeesArray', JSON.stringify(updatedEmployees));
        this._employeesContainer.next(updatedEmployees);
    }


}