import { Injectable } from "@angular/core";
import { Attribute, Employee } from "../models/models";
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

  //filter employees based on the provided search string
  filterEmployeesByAttribute(searchChar: string): Employee[] {
    const employees: Employee[] = JSON.parse(localStorage.getItem('employeesArray') || '[]');
    const attributes: Attribute[] = JSON.parse(localStorage.getItem('attributesArray') || '[]');

    //return all employees if no search term is provided
    if (!searchChar) {
      return employees;
    }

    const searchLower = searchChar.toLowerCase();
    const matchedAttributes = attributes.filter(attr =>
      attr.name.toLowerCase().includes(searchLower)
    );

    if (matchedAttributes.length === 0) {
      return [];
    }

    const matchedIDs = matchedAttributes.map(attr => attr.id);

    //filter employees that have an attributeID matching one of the matched attributes
    return employees.filter(emp => {
      if (!emp.attributeID) return false;
      if (Array.isArray(emp.attributeID)) {
        return emp.attributeID.some((id: number) => matchedIDs.includes(id));
      }
      return matchedIDs.includes(emp.attributeID);
    });
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