import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Atm } from '@models/atm/atm.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = 'https://66a85ecc53c13f22a3d27e90.mockapi.io/api/v1/atms';

  constructor(private http: HttpClient) { }

  getElements(): Observable<Atm[]> {
    return this.http.get<Atm[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createElement(element: Atm): Observable<Atm> {
    return this.http.post<Atm>(this.apiUrl, element).pipe(
      catchError(this.handleError)
    );
  }

  updateElement(element: Atm): Observable<Atm> {
    const url = `${this.apiUrl}/${element.id}`;
    return this.http.put<Atm>(url, element).pipe(
      catchError(this.handleError)
    );
  }

  deleteElement(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
