import { Injectable } from "@angular/core";
import { Employee } from "../models/models";
import { BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

    private _employeesContainer = new BehaviorSubject<Employee[]>(JSON.parse(localStorage.getItem('employeesArray') || '[]' ));
    public employeesContainer = this._employeesContainer.asObservable();

    //function to get all employees
    getAllEmployees(): Observable<Employee[]> {
      return this.employeesContainer;
    }

    //function to create an employee
    addEmployee(employee: Employee): void {
      const storedEmployees: Employee[] = JSON.parse(localStorage.getItem('employeesArray') || '[]');
      const newId = storedEmployees.length > 0 ? Math.max(...storedEmployees.map(emp => emp.id || 0)) + 1 : 1;
      employee.id = newId;
      storedEmployees.push(employee);
      localStorage.setItem('employeesArray', JSON.stringify(storedEmployees));
      this._employeesContainer.next(storedEmployees);
    }

    //function to update an employee
    updateEmployee(employee: Employee): void {
      let storedEmployees: Employee[] = JSON.parse(localStorage.getItem('employeesArray') || '[]');
      const index = storedEmployees.findIndex(emp => emp.id === employee.id);
      if (index !== -1) {
        storedEmployees[index] = { ...storedEmployees[index], ...employee };
        localStorage.setItem('employeesArray', JSON.stringify(storedEmployees));
        this._employeesContainer.next(storedEmployees);
      } else {
        console.warn(`Employee with ID ${employee.id} not found for update.`);
      }
    }

    //function to delete an employee
    deleteEmployee(employee: Employee): void{
      const storedEmployees: Employee[] = JSON.parse(localStorage.getItem('employeesArray') || '[]');
      const updatedEmployees = storedEmployees.filter(emp => emp.id !== employee.id);
      localStorage.setItem('employeesArray', JSON.stringify(updatedEmployees));
      this._employeesContainer.next(updatedEmployees);
    }
}