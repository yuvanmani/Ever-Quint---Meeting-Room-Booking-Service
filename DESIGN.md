### Room Model

-- The Room model includes the fields : name, capacity, floor and amenities.
-- The name field is stored as a string in the database.
-- The capacity field is stored as an integer and must be greater than or equal to 1.
-- The floor field is stored as an integer in the database.
-- The amenities filed is stored as an array of strings in the database.
-- Room details are received from the request body and stored in the database.
-- Validators are applied to ensure integer values are valid and non-negative where applicable.
-- A unique index is created on the name field in the database. 
-- This ensures the prevention of duplicate room names.
-- Upon a successful API call, the newly created room object is returned in the response.


### Booking Model

-- The booking model includes the fields : roomId, title, organizerEmail, startTime, endTime, status.
-- All fields are stored as a string in the database.
-- The start and end times are received in ISO-8601 format.
-- The status field is assigned a default value of confirmed.
-- All other fields are received from the request body and stored in the database.

### Enforcing of no overlaps

-- Filter existing bookings that belong to the same room using roomId.
-- Use the condition startTime < endTime && endTime > startTime to detect overlapping bookings.
-- Performing the overlap check directly in the database using query for efficiency.
-- collect overlapping bookings from the query.
-- If any conflicts are found, return a appropriate message with an HTTP 409 error.

### Error Handling Strategy

-- HTTP 400(Bad Request) : Returned for validation errors when the client sends invalid or incomplete data.
-- HTTP 404(Not Found) : Returned when requested details are not found(e.g : booking or room).
-- errorRoute.js (in the utils folder) : Handles requests to undefined routes and returns a 404 Not Found response.
-- HTTP 409(Conflict) : Returned when a booking conflicts with an existing reservation, such as overlapping time slots.
-- All error responses include appropriate messages to clearly inform the client about the issue.
