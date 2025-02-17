import { Component } from '@angular/core';
import { EmployeesComponent } from "./employees/employees.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AttributesComponent } from "./attributes/attributes.component";
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-home',
  imports: [EmployeesComponent, CommonModule, AttributesComponent,MapComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  constructor(){

  }

  ngOnInit(){
    //alert('IRTHAME')
  }
}
