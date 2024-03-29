Key Directory Descriptions:
/src: The main source directory for all your application code.
/api
/controllers: Contains classes or functions that handle client requests and send responses.
/routes: Defines the endpoints of your API and links them to the controller functions.
/middlewares: Holds middleware functions for tasks such as authentication, error handling, and request logging.
/config: Stores configuration files, like database connection settings.
/services: Encapsulates business logic, often injected into controllers.
/models: Contains Mongoose schemas/models for your MongoDB database.
/lib/helpers: Utility classes or functions used across your application.
/scripts: Maintenance and operational scripts, such as database seeding.
/public: Stores static files like images, stylesheets, and JavaScript files (if applicable).
/tests: Contains your test suites and test cases.
/views: If you decide to have server-rendered views, they would be stored here, but for a headless API used with a Flutter frontend, you may not need this.