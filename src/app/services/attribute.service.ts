import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Attribute } from "../models/models";

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

    public _attributeContainer = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('attributesArray')||'[]'));
    public attributeContainer = this._attributeContainer.asObservable();

    constructor(){
    }
    
    //function to delete an attribute
    deleteAttribute(attribute: any) {
        let storedAttributes:Attribute[] = JSON.parse(localStorage.getItem('attributesArray') || '[]');
        let storedEmployees = JSON.parse(localStorage.getItem('employeesArray') || '[]');

        let updatedAttributes = storedAttributes.filter((attr: any) => attr.id !== attribute.id);

        let updatedEmployees = storedEmployees.map((emp: any) => ({
            ...emp,
            attributeID: emp.attributeID?.filter((attrId: number) => attrId !== attribute.id)
        }));

        console.log('updatedAttributes',updatedAttributes)
        console.log('updatedEmployees',updatedEmployees)
        
        //update localStorage with the new arrays
        localStorage.setItem('attributesArray', JSON.stringify(updatedAttributes));
        localStorage.setItem('employeesArray', JSON.stringify(updatedEmployees));
        this._attributeContainer.next(updatedAttributes);
    }

    
}