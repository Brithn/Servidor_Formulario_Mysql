import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  errorMessage: string | null = null;
users: any;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.getUsers();
  }

  onSubmit(form: any) {
    const formData = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    this.http.post('http://localhost:3000/register', formData).subscribe({
      next: () => alert('Usuario registrado exitosamente'),
      error: (error) => {
        console.error('Error en la solicitud:', error); // Asegúrate de revisar la consola
        this.errorMessage = error?.error?.message || 'Ocurrió un error inesperado'; // Mostrar el mensaje del backend
      },
    });
  }

  getUsers() {
    this.http.get('http://localhost:3000/usuarios').subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error); // Asegúrate de revisar la consola
        this.errorMessage = error?.error?.message || 'Ocurrió un error inesperado'; // Mostrar el mensaje del backend
      },
    });
  }
  deleteUser(id: number) {
    this.http.delete(`http://localhost:3000/delete/${id}`).subscribe({
      next: () => {
        this.getUsers();
      },
      error: (error) => {
        console.error('Error en la solicitud:', error); // Asegúrate de revisar la consola
        this.errorMessage = error?.error?.message || 'Ocurrió un error inesperado'; // Mostrar el mensaje del backend
      },
    });
  }

}
