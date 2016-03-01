# Evolution 2


### API
To implement a RESTful API the [nimble:restivus](https://github.com/kahmali/meteor-restivus) Meteor package was used. The package makes implementing CRUD endpoints for Mongo collections extremely easy. It comes with User authentication features for each request as well as the ability to limit access to certain endpoints based on Roles. It also allows for customization of all http requests. There are numerous other featuers that made this package stand out among others. 

This package was chosen because for the first evolution of the application, the team decided to use meteors *Autoform* package to handle submitting forms and storing them as well as updating them in the database. Autoform also used the *SimpleSchema* package that helped validating forms against a well defined schema. However with Autoform it is difficult to expose endpoints as APIs and so it couldnt be used to create the APIs that were needed. 

With Restivus however, creatin these endpoints are extremely easy. And although these endpoints run in parallel to enpoints we have in the actual app currently they are functionally the same since we are mostly just performing some basic CRUD operations on the items in the database, along with some authorization. In the future if the business logic changes and expands, we will have to think of a way where we can separate the business logic from the endpoints, so that they can be used by both hooks and there is no repeated code. This should be fairly easy as well.

For testing the APIs we used a web tool called POSTMAN. POSTMAN allows you to create custom HTTP requests with custom headers, body and authentication. You can even write custom tests for the responses. It is easy to use and circumvents the need to write a separate tool for testing.

### Oauth
In the previous evolution, user accounts where fully contained in the application. Evolution 2 required integration with Duke NetIDs to work with the website. We used Oauth2 authentification to integrate this. When a user wants to log in with their netID, they press the duke login button on the homepage, which sends a request to the Duke OAuth server to autheticate for our application. Then they user is redirected to an oauth endpoint on our website, where logic in the router is used to extract the access_token returned from Duke. The router then sends the token to the server to do an http get request to duke to retrieve the validated netid. This netid is returned to the client. The issue we are running into is how to treat that result as valid and integrate with the login package system we have in place. 
