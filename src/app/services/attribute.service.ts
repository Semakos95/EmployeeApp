import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Attribute, Employee } from "../models/models";

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

    private _attributeContainer = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('attributesArray')||'[]'));
    public attributeContainer = this._attributeContainer.asObservable();

    
    //function to get all employees
    getAllAttributes(): Observable<Attribute[]> {
        return this.attributeContainer;
    }

    //function to add new attribute
    addAttribute(form: Attribute): void {
        console.log('FORM: ',form)
        const storedAttributes: Attribute[] = JSON.parse(localStorage.getItem('attributesArray') || '[]');
        const newId = storedAttributes.length ? Math.max(...storedAttributes.map(attr => attr.id || 0)) + 1 : 1;
        storedAttributes.push({ id: newId, name: form.name });
        this._attributeContainer.next(storedAttributes);
        localStorage.setItem('attributesArray', JSON.stringify(storedAttributes));
    }
    
    //function to update an attribute
    updateAttribute(form: Attribute): void {
        let storedAttributes: Attribute[] = JSON.parse(localStorage.getItem('attributesArray') || '[]');
        const index = storedAttributes.findIndex(attr => attr.id === form.id);
        if (index !== -1) {
            console.log('FORM: ',form)
            storedAttributes[index].name = form.name;
            this._attributeContainer.next(storedAttributes);
            localStorage.setItem('attributesArray', JSON.stringify(storedAttributes));
        } else {
            console.warn(`Attribute with ID ${form.id} not found!`);
        }
    }

    //function to delete an attribute
    deleteAttribute(attribute: Attribute) {
        const storedAttributes:Attribute[] = JSON.parse(localStorage.getItem('attributesArray') || '[]');
        const storedEmployees = JSON.parse(localStorage.getItem('employeesArray') || '[]');
        const updatedAttributes = storedAttributes.filter((attr: Attribute) => attr.id !== attribute.id);
        const updatedEmployees = storedEmployees.map((emp: Employee) => ({
            ...emp,
            attributeID: emp.attributeID?.filter((attrId: number) => attrId !== attribute.id)
        }));
        
        //update localStorage with the new arrays
        localStorage.setItem('attributesArray', JSON.stringify(updatedAttributes));
        localStorage.setItem('employeesArray', JSON.stringify(updatedEmployees));
        this._attributeContainer.next(updatedAttributes);
    }

    
}