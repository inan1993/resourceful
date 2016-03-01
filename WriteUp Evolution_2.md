# Evolution 2


### API
To implement a RESTful API the [nimble:restivus](https://github.com/kahmali/meteor-restivus) Meteor package was used. The package makes implementing CRUD endpoints for Mongo collections extremely easy. It comes with User authentication features as well as the ability to limit access to certain endpoints based on Roles. 
This package was chosen because for the first evolution of the application, the team decided to use meteors *Autoform* package to handle submitting forms and storing them as well as updating them in the database. Autoform also used the *SimpleSchema* package that helped validating forms against a well defined schema. However with Autoform it is difficult to expose endpoints as APIs and so it couldnt be used to create the APIs that were needed. 
With Restivus however, creatin these endpoints are extremely easy. And although these endpoints run in parallel to enpoints we have in the actual app currently they are functionally the same since we are mostly just performing some basic CRUD operations on the items in the database, along with some authorization. In the future if the business logic changes and expands, we will have to think of a way where we can separate the business logic from the endpoints, so that they can be used by both hooks and there is no repeated code. This should be fairly easy as well.
