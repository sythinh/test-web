import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Atm } from '@models/atm/atm.model';
import { HomeService } from '@core/serives/home/home.service';
import { HomeDialogComponent } from './home-dialog/home-dialog.component';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['atmName', 'manufacturer', 'type', 'serialNumber', 'image', 'actions'];
  dataSource = new MatTableDataSource<Atm>([]);
  errorMessage: string = '';

  constructor(
    public dialog: MatDialog,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.getAllAtms();
  }

  getAllAtms() {
    this.homeService.getElements().subscribe(
      res => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateAtm(element: Atm) {
    this.homeService.updateElement(element).subscribe(
      updatedElement => {
        this.dataSource.data = this.dataSource.data.map(item => item.id === updatedElement.id ? updatedElement : item);
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  deleteAtm(id: number) {
    this.homeService.deleteElement(id).subscribe(
      () => {
        this.dataSource.data = this.dataSource.data.filter(item => item.id !== id);
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  createAtm(element: Atm) {
    this.homeService.createElement(element).subscribe(
      newElement => {
        this.dataSource.data = [...this.dataSource.data, newElement];
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  openDialog(action: string, element?: Atm): void {
    const dialogRef = this.dialog.open(HomeDialogComponent, {
      width: '500px',
      data: { action, element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (action) {
          case 'Create':
            this.createAtm(result);
            break;
          case 'Edit':
            this.updateAtm(result);
            break;
          default:
            break;
        }
      }
    });
  }

  exportToExcel() {
    const exportData = this.dataSource.data.map(item => ({
      ID: item.id,
      AtmName: item.atmName,
      Manufacturer: item.manufacturer,
      Type: item.type,
      SerialNumber: item.serialNumber
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    ws['!cols'] = [
      { wpx: 50 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 150 },
      { wpx: 80 }
    ];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Atms');
    XLSX.writeFile(wb, 'Atms.xlsx');
  }

  confirmDelete(element: Atm): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete ${element.atmName}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAtm(element.id);
      }
    });
  }

  handleAction(action: string, element?: Atm) {
    switch (action) {
      case 'Create':
        this.openDialog('Create');
        break;
      case 'View':
        this.openDialog('View', element);
        break;
      case 'Edit':
        this.openDialog('Edit', element);
        break;
      case 'Delete':
        if (element) {
          this.confirmDelete(element);
        }
        break;
      default:
        break;
    }
  }
}

