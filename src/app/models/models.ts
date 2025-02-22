export interface Employee{
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: number;
    homeAddress: Address;
    ownsVehicle: boolean;
    attributeID: number[];
}

export interface Address {
    street: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
}

export interface Attribute {
    id?: number;
    name: string;
}

export interface DialogData {
    title?: string;           
    message: string;          
    confirmButtonText?: string;
    cancelButtonText?: string;
    singleButton?: boolean;
  }