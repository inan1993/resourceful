An evaluation of your current design, with an analysis of its strengths and weaknesses
going forwards. This section should justify your current design choices, explaining why
you think they will be beneficial to you in the long run. If you recognize weaknesses in
your current design, you should discuss them—including an explanation of why they are
there, and how you plan to fix them in future submissions.

As this is the first evolution of the project, all of the design focused on laying the foundation for the software. The large design choices we made were to make our application web-based and to use the Meteor framework. 

With the Meteor framework, a lot of the design questions were answered for us. The program is broken into client and server-side code, each written in Javascript and all the nitty-gritty work of connecting the two correctly is done under the hood by Meteor. The UI is a dashboard with a calendar-view of 

Storage is all with a Mongo database (again Meteor does all the configurations under the hood).

The components of the application such as accounts, login, calendar are all modular pieces with a simple API to interface between one another.

Our design is powerful because our framework is incredibly powerful. We arranged the components to 
