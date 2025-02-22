import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Attribute, Employee } from '../../models/models';
import { AttributeService } from '../../services/attribute.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule,CommonModule],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  @Input() employeeObj:any;
  @Input() attrObj:any;

  employeeForm!: FormGroup;
  employees: Employee[] = []; 
  attributeForm: FormGroup;
  attributeOptions:any;

  constructor(private fb: FormBuilder, private empService: EmployeeService, private atrService: AttributeService,private dialog: MatDialog){
    this.employeeForm = this.fb.group({
      id:[null],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],//Validators.min(18)
      attributeID: [[], Validators.required],
      homeAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        coordinates: this.fb.group({
          lat: ['', [Validators.required]], //, Validators.pattern("^-?\\d+(\\.\\d+)?$")// Ensures it's a number
          lng: ['', [Validators.required]] //, Validators.pattern("^-?\\d+(\\.\\d+)?$")
        })
      }),
      ownsVehicle: [false, Validators.required]
    });

    this.attributeForm = this.fb.group({
      id:[''],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.loadAttributeOptions();
    this.loadEmployees();

    this.employeeForm.get('homeAddress')?.valueChanges.subscribe(() => {
      //this.autoFillCoordinates();
    });

  }

  //fetch data choosen employee/attribute to the form 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeObj'] && this.employeeObj) {
      this.employeeForm.patchValue(this.employeeObj);
    }else if(changes['attrObj'] && this.attrObj){
      this.attributeForm.patchValue({ id: this.attrObj.id, attribute: this.attrObj.name });
    }
  }


  getControl(controlName: string) {
    return this.employeeForm.get(controlName);
  }

  getAttributeControl(controlName: string){
    return this.attributeForm.get(controlName);
  }


  onCheckboxChange(event: any) {
    const attributeControl = this.employeeForm.get('attributeID');
    const value = parseInt(event.target.value, 10);
    let selectedAttributes: number[] = attributeControl?.value || [];

    if (event.target.checked) {
      if (!selectedAttributes.includes(value)) {
        selectedAttributes.push(value);
      }
    } else {
      selectedAttributes = selectedAttributes.filter(val => val !== value);
    }
    attributeControl?.setValue(selectedAttributes);
  }


  onSubmitEmployee() {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value; 
      const existingName = this.employees.find((attr:any) => attr.firstName.toLowerCase() == formData.firstName.toLowerCase())
      const existingLastName = this.employees.find((attr:any) => attr.lastName.toLowerCase() == formData.lastName.toLowerCase())
      if(existingName && existingLastName){
        this.dialog.open(DialogComponent, {
          data: {
            title: 'Warning!',
            message: `Employee "${existingName.firstName} ${existingLastName.lastName}" already exists! Please create another one`,
            confirmButtonText: 'OK',
            singleButton: true
          }
        });
        return;
      }
      if (formData.id) {
        this.empService.updateEmployee(formData);
      } else {
        this.empService.addEmployee(formData);
      }
      this.closeModal.emit(true);
    } else {
      console.log("Form is invalid");
    }
  }


  onSubmitAttribute(){
    if (this.attributeForm.valid) {
      const formData = this.attributeForm.value;
      const existingAttr = this.attributeOptions.find((attr:any) => attr.name.toLowerCase() == formData.name.toLowerCase())
      if(existingAttr){
        this.dialog.open(DialogComponent, {
          data: {
            title: 'Warning!',
            message: 'This attribute already exists! Please create another one',
            confirmButtonText: 'OK',
            singleButton: true
          }
        });
        return;
      }
      if (formData.id) {
        this.atrService.updateAttribute(formData);
      } else {
        this.atrService.addAttribute(formData);
      }
      this.closeModal.emit(true);
    } else {
      console.log("Form is invalid!");
    }
  }

  eventModalCloserClick() {
    this.closeModal.emit(true);
  }

  loadAttributeOptions() {
    this.atrService.getAllAttributes().subscribe((data: Attribute[]) => {
      this.attributeOptions = data;
    })
  }

  loadEmployees(){
    this.empService.getAllEmployees().subscribe((data: Employee[])=> {
      this.employees = data;
    })
  }

  autoFillCoordinates(){
    let address = this.employeeForm.value.homeAddress;
    if (address.street && address.city && address.country) {
      let fullAddress = `${address.street}, ${address.city}, ${address.country}`;

      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: fullAddress }, (results:any, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          let location = results[0].geometry.location;
          this.employeeForm.patchValue({
            homeAddress: {
              coordinates: {
                lat: location.lat(),
                lng: location.lng()
              }
            }
          });
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    }
  }

}
