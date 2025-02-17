import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {


  constructor(private mapService: MapService){

  }
  
  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;
  map!: google.maps.Map;

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
    let storedEmployees = JSON.parse(localStorage.getItem('employeesArray') || '[]');
    let georgeLocation: google.maps.LatLng | null = null; // Store George's coordinates
    let otherLocations: google.maps.LatLng[] = []; // Store other employees' locations

    storedEmployees.forEach((employee: any) => {
      if (employee.homeAddress && employee.homeAddress.coordinates) {
        const { lat, lng } = employee.homeAddress.coordinates;
        // Default marker icon
        let iconUrl = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"; // Red default marker

        // Change marker color if employee name is George
        if (employee.firstName.toLowerCase() === "george") {
            iconUrl = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            georgeLocation = new google.maps.LatLng(lat, lng);
        }else {
          otherLocations.push(new google.maps.LatLng(lat, lng)); // Store other employees
        }
      
        // Create a marker for each employee's home address
        new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          title: `${employee.firstName} ${employee.lastName}`,
          icon: iconUrl
        });
      }
    });
    if (georgeLocation) {
      this.drawRoutes(georgeLocation, otherLocations);
    }
  }
  drawRoutes(startLocation: google.maps.LatLng, destinations: google.maps.LatLng[]) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: false // Keep original markers
    });

    destinations.forEach(destination => {
        const request = {
            origin: startLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING, // Change to WALKING or BICYCLING if needed
        };

        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                const renderer = new google.maps.DirectionsRenderer({
                    map: this.map,
                    suppressMarkers: true, // Keep original markers
                    polylineOptions: {
                        strokeColor: "#5353cb", // Red route color
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
