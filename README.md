# EmployeesApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.1. It is an Angular-based web application for managing employees and their attributes.

---

## Features

- **Attributes Management**  
  - Create, edit, and delete attribute name.
- **Employee Management**  
  - Create, edit, and delete employees (e.g., name, birth date, address).
- **Association**  
  - Link employees to specific attributes (add/remove).

---

## Data Storage

All data is saved in the browser's **LocalStorage**. This means:
- No external backend or database is required.
- Data persists across page refreshes, but is limited to the local machine and browser.
- Clearing the browser's LocalStorage will remove all saved data.

---

## Development server

To start a local development server, run:

```bash
ng serve
