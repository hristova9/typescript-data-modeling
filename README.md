# TypeScript & Data Modeling

This project implements a simple system for user management, including roles and permissions, post creation, and CRUD operations for both users and posts. The system utilizes TypeScript for static typing, decorators for logging and validation, and a generic `DataBase` class for managing data entities. 

## Features

- **User Roles & Permissions**: Two roles - `Admin` and `User`. Admin can perform CRUD operations, while a regular User can only read posts.
- **Post Management**: Admin can create, read, update, and delete posts. Regular users can only read posts.
- **Database Management**: A `DataBase` class handles CRUD operations for storing and retrieving users and posts.
- **Logging & Validation**: Decorators are used for logging function outputs and validating user emails.

