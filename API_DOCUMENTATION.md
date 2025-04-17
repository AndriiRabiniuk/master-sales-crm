# Sales CRM API Documentation

This document provides comprehensive documentation for the Sales CRM API, designed for frontend developers to integrate with the backend services.

## Table of Contents

- [Authentication](#authentication)
- [Companies](#companies)
- [Clients](#clients)
- [Contacts](#contacts)
- [Leads](#leads)
- [Interactions](#interactions)
- [Notes](#notes)
- [Tasks](#tasks)

## Base URL

All API requests should be made to: `http://localhost:3001/api` or your production server URL.

## Authentication

The API uses JWT (JSON Web Token) based authentication. Most endpoints require a valid access token.

### Headers

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register User

```
POST /auth/register
```

Create a new user account.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string (admin, user, manager)"
}
```

**Response (201):**

```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}
```

#### Login

```
POST /auth/login
```

Authenticate a user and get access token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

#### Get User Profile

```
GET /auth/profile
```

Get the current user's profile.

**Response (200):**

```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}
```

#### Update User Profile

```
PUT /auth/profile
```

Update the current user's profile.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}
```

#### Refresh Token

```
POST /auth/refresh-token
```

Get a new access token using the refresh token.

**Response (200):**

```json
{
  "token": "string"
}
```

#### Logout

```
POST /auth/logout
```

Invalidate the current refresh token.

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

#### Get All Users (Admin Only)

```
GET /auth/users
```

Get a list of all users (admin only).

**Query Parameters:**

- `page`: Page number (optional)
- `limit`: Number of items per page (optional)

**Response (200):**

```json
{
  "users": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  ],
  "page": "number",
  "pages": "number",
  "total": "number"
}
```

#### Delete User (Admin Only)

```
DELETE /auth/users/:id
```

Delete a user by ID (admin only).

**Response (200):**

```json
{
  "message": "User deleted"
}
```

## Companies

### Company Endpoints

#### Get All Companies (Super Admin)

```
GET /companies
```

Get a list of all companies (Super Admin only).

**Response (200):**

```json
[
  {
    "_id": "string",
    "name": "string",
    "SIREN": "string",
    "SIRET": "string",
    "code_postal": "string",
    "code_NAF": "string",
    "chiffre_d_affaires": "number",
    "EBIT": "number",
    "latitude": "number",
    "longitude": "number",
    "pdm": "number",
    "created_at": "string (date-time)"
  }
]
```

#### Get Company by ID

```
GET /companies/:id
```

Get a single company by ID. Super Admins can access any company. Users can only access their own company.

**Response (200):**

```json
{
  "_id": "string",
  "name": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number",
  "created_at": "string (date-time)"
}
```

#### Create Company (Super Admin)

```
POST /companies
```

Create a new company. Only accessible to Super Admins.

**Request Body:**

```json
{
  "name": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number"
}
```

**Response (201):**

```json
{
  "_id": "string",
  "name": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number",
  "created_at": "string (date-time)"
}
```

#### Update Company

```
PUT /companies/:id
```

Update a company. Super Admins can update any company. Company Admins can only update their own company.

**Request Body:**

```json
{
  "name": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number"
}
```

**Response (200):**

```json
{
  "_id": "string",
  "name": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number",
  "created_at": "string (date-time)"
}
```

#### Delete Company (Super Admin)

```
DELETE /companies/:id
```

Delete a company. Only accessible to Super Admins.

**Response (200):**

```json
{
  "message": "Company removed"
}
```

## Clients

### Client Endpoints

#### Get All Clients

```
GET /clients
```

Get a list of all clients.

**Query Parameters:**

- `page`: Page number (optional)
- `limit`: Number of items per page (optional)

**Response (200):**

```json
{
  "clients": [
    {
      "_id": "string",
      "nom": "string",
      "SIREN": "string",
      "SIRET": "string",
      "code_postal": "string",
      "code_NAF": "string",
      "chiffre_d_affaires": "number",
      "EBIT": "number",
      "latitude": "number",
      "longitude": "number",
      "pdm": "number"
    }
  ],
  "page": "number",
  "pages": "number",
  "total": "number"
}
```

#### Search Clients

```
GET /clients/search
```

Search for clients.

**Query Parameters:**

- `term`: Search term (required)
- `page`: Page number (optional)
- `limit`: Number of items per page (optional)

**Response (200):**

```json
{
  "success": true,
  "clients": [
    {
      "_id": "string",
      "nom": "string",
      "SIREN": "string",
      "SIRET": "string",
      "code_postal": "string",
      "code_NAF": "string",
      "chiffre_d_affaires": "number",
      "EBIT": "number",
      "latitude": "number",
      "longitude": "number",
      "pdm": "number"
    }
  ],
  "page": "number",
  "pages": "number",
  "total": "number"
}
```

#### Get Client by ID

```
GET /clients/:id
```

Get a single client by ID.

**Response (200):**

```json
{
  "_id": "string",
  "nom": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number"
}
```

#### Create Client

```
POST /clients
```

Create a new client. Requires admin, manager, or super_admin role.

**Request Body:**

```json
{
  "nom": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number"
}
```

**Response (201):**

```json
{
  "_id": "string",
  "nom": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number"
}
```

#### Update Client

```
PUT /clients/:id
```

Update a client. Requires admin, manager, or super_admin role.

**Request Body:**

```json
{
  "nom": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number"
}
```

**Response (200):**

```json
{
  "_id": "string",
  "nom": "string",
  "SIREN": "string",
  "SIRET": "string",
  "code_postal": "string",
  "code_NAF": "string",
  "chiffre_d_affaires": "number",
  "EBIT": "number",
  "latitude": "number",
  "longitude": "number",
  "pdm": "number"
}
```

#### Delete Client

```
DELETE /clients/:id
```

Delete a client. Requires admin or super_admin role.

**Response (200):**

```json
{
  "message": "Client deleted"
}
```

## Contacts

### Contact Endpoints

#### Get All Contacts

```
GET /contacts
```

Get a list of all contacts associated with the user's company.

**Response (200):**

```json
[
  {
    "_id": "string",
    "user_id": "string",
    "client_id": {
      "_id": "string",
      "nom": "string"
    },
    "nom": "string",
    "prenom": "string",
    "email": "string",
    "telephone": "string",
    "poste": "string",
    "created_at": "string (date-time)"
  }
]
```

#### Get Contact by ID

```
GET /contacts/:id
```

Get a single contact by ID.

**Response (200):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": {
    "_id": "string",
    "nom": "string"
  },
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "telephone": "string",
  "poste": "string",
  "created_at": "string (date-time)"
}
```

#### Create Contact

```
POST /contacts
```

Create a new contact.

**Request Body:**

```json
{
  "client_id": "string",
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "telephone": "string",
  "poste": "string"
}
```

**Response (201):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": "string",
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "telephone": "string",
  "poste": "string",
  "created_at": "string (date-time)"
}
```

#### Update Contact

```
PUT /contacts/:id
```

Update a contact.

**Request Body:**

```json
{
  "client_id": "string",
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "telephone": "string",
  "poste": "string"
}
```

**Response (200):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": "string",
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "telephone": "string",
  "poste": "string",
  "created_at": "string (date-time)"
}
```

#### Delete Contact

```
DELETE /contacts/:id
```

Delete a contact.

**Response (200):**

```json
{
  "message": "Contact removed"
}
```

## Leads

### Lead Endpoints

#### Get All Leads

```
GET /leads
```

Get a list of all leads associated with the user's company.

**Response (200):**

```json
[
  {
    "_id": "string",
    "user_id": "string",
    "client_id": {
      "_id": "string",
      "nom": "string"
    },
    "name": "string",
    "source": "string",
    "statut": "string",
    "valeur_estimee": "number",
    "created_at": "string (date-time)"
  }
]
```

#### Get Lead by ID

```
GET /leads/:id
```

Get a single lead by ID.

**Response (200):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": {
    "_id": "string",
    "nom": "string"
  },
  "name": "string",
  "source": "string",
  "statut": "string",
  "valeur_estimee": "number",
  "created_at": "string (date-time)"
}
```

#### Create Lead

```
POST /leads
```

Create a new lead.

**Request Body:**

```json
{
  "client_id": "string",
  "name": "string",
  "source": "string",
  "statut": "string",
  "valeur_estimee": "number"
}
```

**Response (201):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": "string",
  "name": "string",
  "source": "string",
  "statut": "string",
  "valeur_estimee": "number",
  "created_at": "string (date-time)"
}
```

#### Update Lead

```
PUT /leads/:id
```

Update a lead.

**Request Body:**

```json
{
  "client_id": "string",
  "name": "string",
  "source": "string",
  "statut": "string",
  "valeur_estimee": "number"
}
```

**Response (200):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": "string",
  "name": "string",
  "source": "string",
  "statut": "string",
  "valeur_estimee": "number",
  "created_at": "string (date-time)"
}
```

#### Delete Lead

```
DELETE /leads/:id
```

Delete a lead.

**Response (200):**

```json
{
  "message": "Lead removed"
}
```

## Interactions

### Interaction Endpoints

#### Get All Interactions

```
GET /interactions
```

Get a list of all interactions. Regular users only get interactions for their company.

**Response (200):**

```json
[
  {
    "_id": "string",
    "lead_id": {
      "_id": "string",
      "name": "string"
    },
    "date_interaction": "string (date)",
    "type_interaction": "string",
    "description": "string",
    "contacts": [
      {
        "_id": "string",
        "nom": "string",
        "prenom": "string"
      }
    ],
    "created_at": "string (date-time)"
  }
]
```

#### Get Interaction by ID

```
GET /interactions/:id
```

Get a single interaction by ID.

**Response (200):**

```json
{
  "_id": "string",
  "lead_id": {
    "_id": "string",
    "name": "string"
  },
  "date_interaction": "string (date)",
  "type_interaction": "string",
  "description": "string",
  "contacts": [
    {
      "_id": "string",
      "nom": "string",
      "prenom": "string"
    }
  ],
  "created_at": "string (date-time)"
}
```

#### Create Interaction

```
POST /interactions
```

Create a new interaction.

**Request Body:**

```json
{
  "lead_id": "string",
  "date_interaction": "string (date)",
  "type_interaction": "string",
  "description": "string",
  "contact_ids": ["string"]
}
```

**Response (201):**

```json
{
  "_id": "string",
  "lead_id": "string",
  "date_interaction": "string (date)",
  "type_interaction": "string",
  "description": "string",
  "contacts": ["string"],
  "created_at": "string (date-time)"
}
```

#### Update Interaction

```
PUT /interactions/:id
```

Update an interaction.

**Request Body:**

```json
{
  "lead_id": "string",
  "date_interaction": "string (date)",
  "type_interaction": "string",
  "description": "string",
  "contact_ids": ["string"]
}
```

**Response (200):**

```json
{
  "_id": "string",
  "lead_id": "string",
  "date_interaction": "string (date)",
  "type_interaction": "string",
  "description": "string",
  "contacts": ["string"],
  "created_at": "string (date-time)"
}
```

#### Delete Interaction

```
DELETE /interactions/:id
```

Delete an interaction.

**Response (200):**

```json
{
  "message": "Interaction successfully deleted"
}
```

## Notes

### Note Endpoints

#### Get All Notes

```
GET /notes
```

Get a list of all notes associated with the user's company.

**Response (200):**

```json
[
  {
    "_id": "string",
    "user_id": {
      "_id": "string",
      "username": "string"
    },
    "client_id": {
      "_id": "string",
      "nom": "string"
    },
    "lead_id": {
      "_id": "string",
      "name": "string"
    },
    "content": "string",
    "created_at": "string (date-time)"
  }
]
```

#### Get Note by ID

```
GET /notes/:id
```

Get a single note by ID.

**Response (200):**

```json
{
  "_id": "string",
  "user_id": {
    "_id": "string",
    "username": "string"
  },
  "client_id": {
    "_id": "string",
    "nom": "string"
  },
  "lead_id": {
    "_id": "string",
    "name": "string"
  },
  "content": "string",
  "created_at": "string (date-time)"
}
```

#### Create Note

```
POST /notes
```

Create a new note.

**Request Body:**

```json
{
  "client_id": "string",
  "lead_id": "string",
  "content": "string"
}
```

**Response (201):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": "string",
  "lead_id": "string",
  "content": "string",
  "created_at": "string (date-time)"
}
```

#### Update Note

```
PUT /notes/:id
```

Update a note.

**Request Body:**

```json
{
  "client_id": "string",
  "lead_id": "string",
  "content": "string"
}
```

**Response (200):**

```json
{
  "_id": "string",
  "user_id": "string",
  "client_id": "string",
  "lead_id": "string",
  "content": "string",
  "created_at": "string (date-time)"
}
```

#### Delete Note

```
DELETE /notes/:id
```

Delete a note.

**Response (200):**

```json
{
  "message": "Note removed"
}
```

## Tasks

### Task Endpoints

#### Get All Tasks

```
GET /tasks
```

Get a list of all tasks.

**Response (200):**

```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "dueDate": "string (date-time)",
    "assignedTo": "string",
    "client": "string",
    "lead": "string",
    "status": "string",
    "createdBy": "string",
    "createdAt": "string (date-time)",
    "updatedAt": "string (date-time)"
  }
]
```

#### Get Task by ID

```
GET /tasks/:id
```

Get a single task by ID.

**Response (200):**

```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "dueDate": "string (date-time)",
  "assignedTo": "string",
  "client": "string",
  "lead": "string",
  "status": "string",
  "createdBy": "string",
  "createdAt": "string (date-time)",
  "updatedAt": "string (date-time)"
}
```

#### Create Task

```
POST /tasks
```

Create a new task.

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "dueDate": "string (date-time)",
  "assignedTo": "string",
  "client": "string",
  "lead": "string",
  "status": "string ('pending', 'in-progress', 'completed', 'cancelled')"
}
```

**Response (201):**

```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "dueDate": "string (date-time)",
  "assignedTo": "string",
  "client": "string",
  "lead": "string",
  "status": "string",
  "createdBy": "string",
  "createdAt": "string (date-time)",
  "updatedAt": "string (date-time)"
}
```

#### Update Task

```
PUT /tasks/:id
```

Update a task.

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "dueDate": "string (date-time)",
  "assignedTo": "string",
  "client": "string",
  "lead": "string",
  "status": "string ('pending', 'in-progress', 'completed', 'cancelled')"
}
```

**Response (200):**

```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "dueDate": "string (date-time)",
  "assignedTo": "string",
  "client": "string",
  "lead": "string",
  "status": "string",
  "createdBy": "string",
  "createdAt": "string (date-time)",
  "updatedAt": "string (date-time)"
}
```

#### Delete Task

```
DELETE /tasks/:id
```

Delete a task.

**Response (200):**

```json
{
  "message": "Task deleted"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Error message describing the issue"
}
```

### 401 Unauthorized

```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden

```json
{
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "message": "Server error message"
}
``` 