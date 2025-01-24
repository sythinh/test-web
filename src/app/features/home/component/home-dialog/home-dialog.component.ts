import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Atm } from '@models/atm/atm.model';

@Component({
  selector: 'app-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss']
})
export class HomeDialogComponent implements OnInit {
  form!: FormGroup;
  imagePreview: string | ArrayBuffer | null = '';
  selectedFileNames: string = '';
  imageSize: number = 0;
  maxImageSize: number = 20 * 1024;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {action: string, element: Atm}
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data.element?.id],
      atmName: [this.data.element?.atmName],
      manufacturer: [this.data.element?.manufacturer],
      type: [this.data.element?.type],
      serialNumber: [this.data.element?.serialNumber],
      image: [this.data.element?.image]
    });
    this.imagePreview = this.data.element?.image || null;
  }

  onSaveClick(): void {
    this.dialogRef.close(this.form.value);
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  selectFiles(event: any): void {
    this.selectedFileNames = event.target.files[0]?.name;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imageSize = file.size;

      if (this.imageSize > this.maxImageSize) {
        alert("The image size exceeds the allowed limit (20KB).");
        this.selectedFileNames = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.patchValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
}