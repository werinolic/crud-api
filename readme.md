# How to Run the Project
## Install Dependencies:

```bash
npm install
```

## Run in Development Mode:

```bash
npm run start:dev
```

## Run in Production Mode:

```bash
npm run build
npm run start:prod
```

## API Endpoints

### GET /api/users - Retrieve all users.
```
curl -X GET http://localhost:3000/api/users
```

### GET /api/users/{userId} - Retrieve a user by ID.
```
curl -X GET http://localhost:3000/api/users/{userId}
```

### POST /api/users - Create a new user.
```
curl -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{
        "username": "John Doe",
        "age": 30,
        "hobbies": ["Reading", "Traveling"]
      }'
```

### PUT /api/users/{userId} - Update an existing user.
```
curl -X PUT http://localhost:3000/api/users/{userId} \
  -H 'Content-Type: application/json' \
  -d '{
        "username": "Jane Doe",
        "age": 28,
        "hobbies": ["Writing", "Hiking"]
      }'

```

### DELETE /api/users/{userId} - Delete a user.
```
curl -X DELETE http://localhost:3000/api/users/{userId}
```