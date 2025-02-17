import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {
    
    constructor(){
        this.openGoogleMaps()
    }
    //create function that can fetch employee by attribute
    getEmployeesByAttribute(attribute: string):Observable<any>{

        let storedAttributes = JSON.parse(localStorage.getItem('attributesArray') || '[]');
        let storedEmployees = JSON.parse(localStorage.getItem('employeesArray') || '[]');
        let matchedAttribute = storedAttributes.find((attr: any) => attr.name === attribute);
        if (!matchedAttribute) {
            alert('den uparxei to xaraktiristiko')
        }

        let attributeID = matchedAttribute.id;
        let matchedEmployees = storedEmployees.filter((employee: any) => 
            employee.attributeID?.includes(attributeID)
        );
        //alert('GO')
        return of(matchedEmployees)
    }

    //function for selecting desired employee and then map to pin the position
    navTo(){

    }

    //function for creating pins to all employees addresses
    createPinsToEmpAddresses(){
       
        new google.maps.Marker({
            position: { lat: 40.7128, lng: -74.006 },
            //map: //map,
            title: "New York City"
        });
    }

    openGoogleMaps() {
        //const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
       // window.open(url, '_blank');
        // alert('ee')
        // window.open('https://www.google.com/maps', '_blank');
      }
      
}