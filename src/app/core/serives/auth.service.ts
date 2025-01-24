import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private validUsername = 'user';
  private validPassword = 'password';
  private isLoggedIn = false;

  login(username: string, password: string): boolean {
    if (username === this.validUsername && password === this.validPassword) {
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
