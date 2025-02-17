import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Attribute, Employee } from '../../models/models';
import { AttributeService } from '../../services/attribute.service';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule,CommonModule],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  @Input() employeeObj:any ;
  @Input() attrObj:any;

  employeeForm!: FormGroup;
  attributeForm: FormGroup;
  attributeOptions:any;


  
  constructor(private fb: FormBuilder, private empService: EmployeeService, private atrService:AttributeService){
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
          lat: ['', [Validators.required, Validators.pattern("^-?\\d+(\\.\\d+)?$")]], // Ensures it's a number
          lng: ['', [Validators.required, Validators.pattern("^-?\\d+(\\.\\d+)?$")]]
        })
      }),
      ownsVehicle: [false, Validators.required]
    });

    this.attributeForm = this.fb.group({
      id:[''],
      attribute: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.loadAttributeOptions();
    console.log('ta attributesss',this.attributeOptions)

    this.employeeForm.get('homeAddress')?.valueChanges.subscribe(() => {
      this.autoFillCoordinates();
    });

    //this.onSubmitAttribute()
  }
  //fetch data choosen employee/attribute to the form 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeObj'] && this.employeeObj) {
      this.employeeForm.patchValue(this.employeeObj);
    }else if(changes['attrObj'] && this.attrObj){
      this.attributeForm.patchValue({ id: this.attrObj.id, attribute: this.attrObj.name });
    }
  }

  ngOnInit(){


  }
  ngAfterViewInit(){

  }
  ngOnDestroy(){
    //alert('pame')
  }

  getControl(controlName: string) {
    return this.employeeForm.get(controlName);
  }

  getAttributeControl(controlName: string){
    return this.attributeForm.get(controlName);
  }


  onCheckboxChange(event: any) {
    const attributeControl = this.employeeForm.get('attributeID');
    // Make sure we are working with numbers (assuming attribute.id is a number)
    const value = parseInt(event.target.value, 10);
    let selectedAttributes: number[] = attributeControl?.value || [];

    if (event.target.checked) {
      // Add the attribute ID if not already included
      if (!selectedAttributes.includes(value)) {
        selectedAttributes.push(value);
      }
    } else {
      // Remove the attribute ID
      selectedAttributes = selectedAttributes.filter(val => val !== value);
    }
    attributeControl?.setValue(selectedAttributes);
  }

  onSubmitEmployee() {
    let storedEmployees: Employee[] = JSON.parse(localStorage.getItem('employeesArray') || '[]');

    if (this.employeeForm.valid) {
      let formData = this.employeeForm.value; 
      if (formData.id) {

        let index = storedEmployees.findIndex(emp => emp.id === formData.id);
        if (index !== -1) {
          storedEmployees[index] = { ...storedEmployees[index], ...formData };
        }
      } else {
        // Add mode: generate a new ID and add the employee
        let newId = storedEmployees.length > 0 ? Math.max(...storedEmployees.map(emp => emp.id || 0)) + 1 : 1;
        formData.id = newId;
        storedEmployees.push(formData);
      }
      console.log('AFTER',storedEmployees)
      localStorage.setItem('employeesArray', JSON.stringify(storedEmployees));
      this.empService._employeesContainer.next(storedEmployees)
      this.closeModal.emit(true);

    } else {
      console.log("Form is invalid");
    }
  }


  onSubmitAttribute(){
    let storedAttributes: Attribute[] = JSON.parse(localStorage.getItem('attributesArray') || '[]');
    if (this.attributeForm.valid) {
      let formData = this.attributeForm.value;
      console.log('FORMDATA',formData)
      if (formData.id) {
        //update
        let index = storedAttributes.findIndex((attr: any) => attr.id === formData.id);
        console.log('index',index)
        if (index !== -1) {
          storedAttributes[index].name = formData.attribute;
        }
      } else {
        //create
        let newId = storedAttributes.length ? Math.max(...storedAttributes.map((attr: any) => attr.id || 0)) + 1 : 1;
        storedAttributes.push({ id: newId, name: formData.attribute });
      }
      localStorage.setItem('attributesArray', JSON.stringify(storedAttributes));
      //edw
      this.atrService._attributeContainer.next(storedAttributes);
      this.closeModal.emit(true);
    } else {
      console.log("Form is invalid!");
    }
  }

  eventModalCloserClick() {
    this.closeModal.emit(true);
  }

  loadAttributeOptions() {
    let storedAttributes = localStorage.getItem('attributesArray');
    if (storedAttributes) {
      this.attributeOptions = JSON.parse(storedAttributes);
    }
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
