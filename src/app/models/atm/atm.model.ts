export class Atm {
    id: number;
    atmName: string;
    manufacturer: string;
    type: string;
    serialNumber: number;
    image: string;
  
    constructor(id: number, atmName: string, manufacturer: string, type: string, serialNumber: number, image: string) {
      this.id = id;
      this.atmName = atmName;
      this.manufacturer = manufacturer;
      this.type = type;
      this.serialNumber = serialNumber;
      this.image = image;
    }
  }