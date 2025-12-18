# Ever Quint -Meeting Room Booking Service

This backend application has been developed using Node.js, Express.js and MongoDB. Key features of 
the application include :

-- The data model and error handling strategy are documented in the DESIGN.md file.
-- This application follows the Model-View-Controller pattern, ensuring clear separation of concerns.
-- Routes, controller logic, and models are maintained in separate folders for better readability and maintainability.
-- This application currently implements four fully functional API endpoints.

## End Points 

-- Room
  Create a new room : POST /rooms
  List rooms : GET /rooms

-- Booking
  Create a new booking : POST /bookings
  List bookings : GET /bookings

## About application

-- All given instructions have been strictly followed throughout the application,
-- Proper validation is implemented consistently across all modules to ensure data integrity.
-- API responses use appropriate HTTP status codes based on the action performed.
-- All endpoints and conditions have been tested using Postman to ensure reliability.
-- The utils folder includes three utility files --- config.js, logger.js, and errorRoute.js --- for configuration management, logging, and error handling.


### config.js
-- Application credentials are managed via the .env file using the dotenv library.
-- By isolating sensitive information in the .env file, the application ensures the protection of personal and confidential data.

### logger.js
-- All incoming requests are logged using this dedicated middleware function.
-- The middleware captures essential request details, including method, parameters, query, headers, URL, cookies, timestamp, and body.

### errorRoute.js
-- This middleware handles requests made to undefined routes.
-- It returns a clear "Not Found" message along with the appropriate HTTP status code 404.

### app.js
-- The server application is initialized using express().
-- Incoming requests are processed and routed based on the defined application routes.
-- Custom middleware such as logger.js and errorRoute.js are integrated to enhance logging, error handling, and overall application effectiveness.
-- The built-in express.json() middleware is used to parse incoming request bodies in JSON format.

### server.js
-- Establishes and manages the connection to the database during server initialization.
-- Starts the HTTP server by calling app.listen() on the configured express application.

### Testing of End Points

-- All POST and GET requests have been thoroughly tested, and appropriate HTTP status codes are implemented based on the action performed.
-- Input validations are properly implemented to prevent invalid requests.
-- All API endpoints and corresponding test results are comprehensively documented in a PDF file attached to this repository,
-- Error handling and response messages are standardized to provide clear and meaningful feedback for both successful and failed requests.