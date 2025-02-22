import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Attribute, Employee } from "../models/models";

@Injectable({
  providedIn: 'root'
})
export class MapService {

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
      
}