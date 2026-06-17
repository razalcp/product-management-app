# Repositories

This directory implements the Repository Pattern for the application.
Repositories are responsible for abstracting the database layer. They encapsulate all database queries and interactions (using Mongoose models).
By using repositories, the services are decoupled from the specific database implementation, making the codebase easier to maintain and test.
