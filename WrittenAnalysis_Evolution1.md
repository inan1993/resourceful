# Written Analysis for Evolution 1
## Resourceful LLC

As this is the first evolution of the project, all of the design decisions are focused on laying the initial foundation for the software. The large design choices we made were to make our application web-based and to use the Meteor framework. 

### The Meteor Framework
The Meteor framework is a pure Javascript framework utilizing the MEAN stack. Having a full stack bundled in a single Framework simplfied a lot of the design questions for us. The program is broken into client and server-side code and the data, referred to as Collections, are stored in a MongoDB with the Schemas acessible in the lib directory. Meteor has built in interfaces for smooth stack integration and provides CRUD services for easy database manipulation.

#### The Client
Meteor uses a template/stylesheet model on its client. Each template groups a modular piece of HTML and its corresponding Javascript file together. By established convention, Meteor applies the Javascript file to the HTML file which have shared names. Stylesheets are separated from templates and contains all the CSS for the DOM elements of the templates. The only template that is not contained in the template folder is the main page. The main page contains all website globals, such as tab title, background and any other future features which is eligible to be applied to all template pages.

##### Login Template
Login is broken into two pieces: The initial Admin Creation and all the subsequent logins. Both login directs to Dashboard which is also the root page of this website. The Javascript on these two templates both direct to server side code which handles password encryption and email confirmations.

##### Dashboard Template
The Dashboard template Allows Admin to add users as well as manage resources. Users are able to search for resources on the Dashboard. Adding users and resources call upon Javascript which create new Objects in the MongoDB. The operations are simple with CRUD already incorporated in Meteor. On the contrary, users searching for resouces were more problematic. Our approach for this evolution was to use regex expressions to match the tags and enable searching. Regex has major draw backs in terms of readability of code as well as flexibility and scalability for future tags. It was chosen because it is powerful under simpler circumstances of tag matching for this Evolution. Further evolutions will investigate other forms of searching and tag addition.

##### Addition Template
True to its name, Addition allows you to add resources, the as a future possibility, more than one admin. Auto notifications are sent via Toastr on success or failure of resource reservation. The Javascript for adding additional Admins partly overlap with the createAdmin Javascript page. This provides for future possibilities of refactoring the code. However, attempts at refactoring would most probably require reorganizing template groups in order to adhere to Meteor framework structure.

##### Other Templates
The Layout Template is similar to main. Currently, it contains a Navbar which is persistent across all pages. The Application Template takes care of user errors. It contains enrollAccount which allows users to reset their passwords as well as a custom Forbidden page for users attempting to access Admin Priveleges. Finally, the landing page is a handy construction page which we will direct visitors to when the site is under construction.


#### The Server
The server handles user authentication and database searches. These are simple Javascript files which rely on Node.js. Hence, Meteor uses solely encrypted https exchanges.

##### Search.js
Parse tags by Regex and then performs database searches. Regex drawback has been previously discussed and will come under consideration if there are further developments in searchng functionality in furture evolutions.

##### User-Config.js
The core logic here is to verfiy uniqeness of user account and encryption of passwords which the Accounts package of Metoer does automatically with hashes and salts. Admin priveleges are assigned here. As of current evolution, email is still under development. However, there are concrete plans for using a scheduler and a third party mail server. One area of testing which we will consider in future evolutions is the correlation of load and server speed.

#### The Database
Storage of all the collections (resources, users, reservations) is all with a MongoDB database (again Meteor does all the configurations for this under the hood). The benefit of using MongoDB is that adding fields to entries is easy -- it is schema-less and that one can index on any field of a document with MongoDB. We are certain than in future evolutions, we will need to store more/different types of information. Using MongoDB renders our data storage process extremely extensible. 

### Testing
As of now, we are consistenly printing state to console to keep track of development and making use of toastr notification for client facing events. In future, we may wish to look into web testing tools. 

### Thoughts on product design and the Meteor Framework
The overall problem was broken down into the smallest level problems. And each was approached individually, the best solutions were chosen to solve each problem, which were then incorporated into a whole. This approach to solving the problem is conducive to using many small services versus using a single monolithic application. This also helps divide the labor among the members of the team. 
We tried to break down our project into small services. Each functionality is separated and modular. There are places where the code could be designed better so that we could re-use more code. We decided that checking off the requirements were more important than spending time thinking about the best design (which could be changed later since they were more of a PitS problem). 
With regards to smaller scale design there were a few good decisions as well as a few bad decisions. Meteor uses a package manager called AtmosphereJS, which has numerous packages that can be included in your app and used easily. And since we used the pre-baked packages for some features, our choice of framework eventually dictated the design of our project. For example the way iron:router (a meteor package) works is by matching routes to templates which are then displayed on the browser. Since this was how the package defaulted we stuck to this design to ensure uniformity throughout the code base.
Various other components of the application such as having user accounts, the login function, and the calendar are all modular pieces with a simple APIs to interface between one another. The core of these features are packages built-on/installable in Meteor, so all that we had to do as programmers was connect the html and call the built-in funcitons where appropriate. However, there is a significant amount of logic that we built on top of these components (controlling access to admin-only pages, creating new reservations properly, and so on).
It's hard to find serious issues with our design since so far there have been simple, effective ways to code every single component that we need while mainting moduarity of features and thus extensibility. There are a few small drawbacks. For instance, some of the default behaviour in the Meteor packages that we used do not behave entirely as expected, and with just the API method at our disposal it can be difficult to find work arounds. One specific example of this was that in the login Meteor package, calling the createUser() function autmatically logs the new user in upon sucessful creation. However, since our admin is creating the users, we don't want that funcitonality. Learning how to alter this behaviour required research and extra work. However, overall the benefits of using the prebuilt Meteor package certainly outweigh the time and effort that would be required to build say, and entire login feature from scratch (and it would be redundant since it has already been developed a thousand times over across the world of computer science).
