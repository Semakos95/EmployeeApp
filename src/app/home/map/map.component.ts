import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Attribute, Employee } from '../../models/models';
import { EmployeeService } from '../../services/employee.service';


@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule,FormsModule,CommonModule],
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent{
  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;
  map!: google.maps.Map;

  filteredEmployees:any;
  employeeList:Employee[] = [];
  private mapURL:string = 'http://maps.google.com/maps/api/staticmap?size=959x680&zoom=16&scale=2&sensor=false&key=AIzaSyDF7p0HWCMOe6aVMMId2Lj9NzZ2hNQPA0c';
  searchChar: string = '';


  constructor(private employeeService:EmployeeService) {
  }

  ngOnInit(){
    this.employeeService.getAllEmployees().subscribe((emp:Employee[]) =>{
      this.employeeList = emp;
    })
  }


  get filteredNames(): Employee[] {
    return this.employeeService.filterEmployeesByAttribute(this.searchChar);
  }

  onSelect(e:MouseEvent,employee:Employee){
    console.log(employee)
    const { lat, lng } = employee.homeAddress.coordinates;
    let iconUrl = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    let empLocation = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: `${employee.firstName} ${employee.lastName}`,
      icon: iconUrl
    });
  }

  ngAfterViewInit(){
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { 
        lat: 37.9440,
        lng: 23.7637 
      },
      zoom: 12,
    });
    this.addEmployeeMarkers();
  }


  addEmployeeMarkers() {
    let selected = true
    let storedEmployees = this.employeeList;
    let empLocation: google.maps.LatLng[] = []; 

    storedEmployees.forEach((employee: any) => {
      if (employee.homeAddress && employee.homeAddress.coordinates) {
        const { lat, lng } = employee.homeAddress.coordinates;
        console.log('LAT',lat)
        console.log('lng',lng)
        let iconUrl = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"; 
        empLocation.push(new google.maps.LatLng(lat, lng)); 
        console.log('empLocation',empLocation)
        new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          title: `${employee.firstName} ${employee.lastName}`,
          icon: iconUrl
        });
      }
    });
   
      //this.drawRoutes(georgeLocation, otherLocations);
    
  }
  drawRoutes(startLocation: google.maps.LatLng, destinations: google.maps.LatLng[]) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: false 
    });

    destinations.forEach(destination => {
        const request = {
            origin: startLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                const renderer = new google.maps.DirectionsRenderer({
                    map: this.map,
                    suppressMarkers: true, 
                    polylineOptions: {
                        strokeColor: "#5353cb", 
                        strokeOpacity: 0.7,
                        strokeWeight: 4
                    }
                });
                renderer.setDirections(result);
            } else {
                console.error("Error fetching directions:", status);
            }
        });
    });

    console.log("Routes drawn from George to other locations.");
}

}
