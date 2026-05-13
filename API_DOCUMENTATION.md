# Tour API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

---

## Authentication

### Public Endpoints
- Sign Up
- Login
- Forgot Password
- Reset Password

### Protected Endpoints
- Require a valid JWT token in the Authorization header or as a cookie
- Header format: `Authorization: Bearer <token>`

### Role-Based Access Control
- **Admin**: Full access to all resources
- **Lead-Guide**: Can manage tours and access admin endpoints
- **User**: Can create and manage reviews, update own profile

---

## TOUR ENDPOINTS

### 1. Get All Tours
```
GET /tours
```
**Description**: Retrieve a list of all available tours with optional filtering, sorting, and pagination.

**Authentication**: Not required

**Query Parameters**:
- `limit`: Number of results per page (default: unlimited)
- `sort`: Sort results by field (prefix with `-` for descending order)
- `fields`: Select specific fields to return
- `page`: Page number for pagination
- `duration`: Filter by tour duration
- `difficulty`: Filter by difficulty level (easy, medium, difficult)
- `price`: Filter by price range

**Response**: 
```json
{
  "status": "success",
  "results": 29,
  "data": {
    "data": [
      {
        "_id": "...",
        "name": "Tour Name",
        "duration": 5,
        "maxGroupSize": 20,
        "difficulty": "easy",
        "ratingsAverage": 4.8,
        "price": 497,
        ...
      }
    ]
  }
}
```

---

### 2. Get Top 5 Cheapest Tours
```
GET /tours/top-5-cheap
```
**Description**: Retrieve the top 5 cheapest tours with highest ratings as an alias route.

**Authentication**: Not required

**Response**: Returns 5 tours sorted by rating (descending) and price with selected fields only.

---

### 3. Get Tour Statistics
```
GET /tours/tour-stats
```
**Description**: Get aggregated statistics for all tours including average rating, price ranges, and number of tours grouped by difficulty level.

**Authentication**: Not required

**Response**:
```json
{
  "status": "success",
  "data": {
    "stats": [
      {
        "_id": "EASY",
        "numTours": 8,
        "numRatings": 540,
        "avgRating": 4.6,
        "avgPrice": 342.12,
        "minPrice": 297,
        "maxPrice": 447
      }
    ]
  }
}
```

---

### 4. Get Tours Within Distance
```
GET /tours/tours-within/:distance/center/:latlng/unit/:unit
```
**Description**: Find all tours within a specified distance from a geographic center point using geospatial queries.

**Authentication**: Not required

**URL Parameters**:
- `distance`: Distance in miles (mi) or kilometers (km)
- `latlng`: Coordinates in format `latitude,longitude`
- `unit`: Unit of measurement (`mi` for miles or `km` for kilometers)

**Example**: 
```
GET /tours/tours-within/233/center/34.111745,-118.113491/unit/mi
```

**Response**:
```json
{
  "status": "Success",
  "results": 3,
  "data": {
    "data": [...]
  }
}
```

---

### 5. Get Distances from Point
```
GET /tours/distances/:latlng/unit/:unit
```
**Description**: Calculate distances from a specific geographic point to all tours' start locations.

**Authentication**: Not required

**URL Parameters**:
- `latlng`: Coordinates in format `latitude,longitude`
- `unit`: Unit of measurement (`mi` for miles or `km` for kilometers)

**Response**: Returns tours with calculated distances from the specified point.

---

### 6. Get Monthly Plan for Year
```
GET /tours/monthly-plan/:year
```
**Description**: Get an overview of the tour schedule for a specific year, showing the number of tours starting each month.

**Authentication**: Required | **Roles**: admin, lead-guide

**URL Parameters**:
- `year`: Year in format YYYY (e.g., 2024)

**Response**:
```json
{
  "status": "success",
  "data": {
    "plan": [
      {
        "numTourStarts": 5,
        "month": 1,
        "tour": ["Tour Name 1", "Tour Name 2", ...]
      }
    ]
  }
}
```

---

### 7. Get Single Tour
```
GET /tours/:id
```
**Description**: Retrieve detailed information about a specific tour including all reviews.

**Authentication**: Not required

**URL Parameters**:
- `id`: Tour ID

**Response**:
```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "...",
      "name": "Tour Name",
      "reviews": [...]
    }
  }
}
```

---

### 8. Create New Tour
```
POST /tours
```
**Description**: Create a new tour. Only for administrators and lead guides.

**Authentication**: Required | **Roles**: admin, lead-guide

**Request Body**:
```json
{
  "name": "Tour Name",
  "duration": 5,
  "maxGroupSize": 25,
  "difficulty": "medium",
  "ratingsAverage": 4.5,
  "price": 397,
  "priceDiscount": 0,
  "summary": "Tour summary",
  "description": "Detailed description"
}
```

**Response**: Returns the created tour object.

---

### 9. Update Tour
```
PATCH /tours/:id
```
**Description**: Update an existing tour's information. Only for administrators and lead guides.

**Authentication**: Required | **Roles**: admin, lead-guide

**URL Parameters**:
- `id`: Tour ID

**Request Body**: Any fields to update (partial update)

**Response**: Returns the updated tour object.

---

### 10. Delete Tour
```
DELETE /tours/:id
```
**Description**: Delete a tour permanently. Only for administrators and lead guides.

**Authentication**: Required | **Roles**: admin, lead-guide

**URL Parameters**:
- `id`: Tour ID

**Response**: 
```json
{
  "status": "success",
  "data": null
}
```

---

## USER ENDPOINTS

### 1. Sign Up
```
POST /users/signup
```
**Description**: Create a new user account and receive a JWT token.

**Authentication**: Not required

**Request Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response**: Returns the new user and JWT token.

---

### 2. Login
```
POST /users/login
```
**Description**: Authenticate user credentials and receive a JWT token.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: Returns user data and JWT token.

---

### 3. Forgot Password
```
POST /users/forgotPassword
```
**Description**: Request a password reset token sent to the user's email address.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**: Confirmation message that reset email has been sent.

---

### 4. Reset Password
```
PATCH /users/resetPassword/:token
```
**Description**: Reset user password using a reset token from the forgot password email.

**Authentication**: Not required

**URL Parameters**:
- `token`: Password reset token received via email

**Request Body**:
```json
{
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

**Response**: Returns updated user and new JWT token.

---

### 5. Update Own Password
```
PATCH /users/updatePassword
```
**Description**: Update the currently logged-in user's password.

**Authentication**: Required

**Request Body**:
```json
{
  "passwordCurrent": "currentPassword123",
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

**Response**: Returns updated user and new JWT token.

---

### 6. Get Current User Profile
```
GET /users/me
```
**Description**: Retrieve the profile of the currently authenticated user.

**Authentication**: Required

**Response**: Returns current user data.

---

### 7. Update Own Profile
```
PATCH /users/updateMe
```
**Description**: Update current user's name and email (non-sensitive information).

**Authentication**: Required

**Request Body**:
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

**Response**: Returns updated user data.

---

### 8. Delete Own Account
```
DELETE /users/deleteMe
```
**Description**: Deactivate the current user's account (soft delete).

**Authentication**: Required

**Response**: No content returned (status 204).

---

### 9. Get All Users
```
GET /users
```
**Description**: Retrieve a list of all users. Admin only.

**Authentication**: Required | **Roles**: admin

**Query Parameters**: Same filtering and pagination options as tours.

**Response**: Returns array of all users.

---

### 10. Get Single User
```
GET /users/:id
```
**Description**: Retrieve detailed information about a specific user. Admin only.

**Authentication**: Required | **Roles**: admin

**URL Parameters**:
- `id`: User ID

**Response**: Returns user data.

---

### 11. Create User (Admin)
```
POST /users
```
**Description**: This route is not implemented. Use `/signup` for user registration instead.

**Authentication**: Required | **Roles**: admin

**Response**: Error message directing to use `/signup`.

---

### 12. Update User (Admin)
```
PATCH /users/:id
```
**Description**: Update a user's information as an administrator.

**Authentication**: Required | **Roles**: admin

**URL Parameters**:
- `id`: User ID

**Request Body**: Fields to update

**Response**: Returns updated user data.

---

### 13. Delete User (Admin)
```
DELETE /users/:id
```
**Description**: Delete a user permanently as an administrator.

**Authentication**: Required | **Roles**: admin

**URL Parameters**:
- `id`: User ID

**Response**: No content returned (status 204).

---

## REVIEW ENDPOINTS

### 1. Get All Reviews
```
GET /reviews
```
OR (for specific tour)
```
GET /tours/:tourId/reviews
```
**Description**: Retrieve all reviews or all reviews for a specific tour with optional filtering and pagination.

**Authentication**: Required

**Query Parameters**: Filtering, sorting, and pagination options.

**Response**:
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "data": [
      {
        "_id": "...",
        "review": "Great tour!",
        "rating": 5,
        "tour": "...",
        "user": "..."
      }
    ]
  }
}
```

---

### 2. Get Single Review
```
GET /reviews/:id
```
OR (for specific tour)
```
GET /tours/:tourId/reviews/:id
```
**Description**: Retrieve a specific review by ID.

**Authentication**: Required

**URL Parameters**:
- `id`: Review ID
- `tourId` (optional): Tour ID for nested route

**Response**: Returns review data.

---

### 3. Create Review
```
POST /reviews
```
OR (for specific tour)
```
POST /tours/:tourId/reviews
```
**Description**: Create a new review for a tour. Only regular users can create reviews.

**Authentication**: Required | **Roles**: user

**URL Parameters**:
- `tourId` (optional): Tour ID (will be set automatically if not provided)

**Request Body**:
```json
{
  "review": "Great experience!",
  "rating": 4,
  "tour": "tourId (optional)",
  "user": "userId (auto-set)"
}
```

**Response**: Returns the created review.

---

### 4. Update Review
```
PATCH /reviews/:id
```
OR (for specific tour)
```
PATCH /tours/:tourId/reviews/:id
```
**Description**: Update an existing review. Only the review owner or admin can update.

**Authentication**: Required | **Roles**: user, admin

**URL Parameters**:
- `id`: Review ID
- `tourId` (optional): Tour ID for nested route

**Request Body**:
```json
{
  "review": "Updated review text",
  "rating": 5
}
```

**Response**: Returns updated review data.

---

### 5. Delete Review
```
DELETE /reviews/:id
```
OR (for specific tour)
```
DELETE /tours/:tourId/reviews/:id
```
**Description**: Delete a review permanently. Only the review owner or admin can delete.

**Authentication**: Required | **Roles**: user, admin

**URL Parameters**:
- `id`: Review ID
- `tourId` (optional): Tour ID for nested route

**Response**: No content returned (status 204).

---

## Error Responses

### Standard Error Format
```json
{
  "status": "fail",
  "message": "Error description"
}
```

### Common Status Codes
- `200`: OK - Request successful
- `201`: Created - Resource successfully created
- `204`: No Content - Request successful with no content to return
- `400`: Bad Request - Invalid request parameters
- `401`: Unauthorized - Authentication required or failed
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server error

---

## Authentication Header Example
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rate Limiting & Security Notes
- All sensitive operations require authentication
- Passwords are never returned in responses
- Email confirmation is required for certain operations
- JWT tokens expire as per `JWT_EXPIRES_IN` environment variable
- HTTPS is enforced in production
- XSS and data sanitization protections are in place
