##Team Resourceful
###Evolution 4

####Hierarchy Requirement Specificaion
For approaching the requirement for hierarchical resources, we took the approach that visibility is limited to the parent resource. That is, if a child of a resource can be viewed by a user but the parent resource cannot be viewed by the user, then the user will not see the child nor the parent in the tree. See the graphical example here: ![Hierarchy Example](/hierarchy1.png)

There are three users A, B, and C. The three users have view priveleges for all the resources except Child 2, which only A and B have view privileges for. Thus, user C will have the following view of the resources:

![Hierarchy Example](/hierarchy_C.png)

while users A and B will see the following:

![Hierarchy Example](/hierarchy_A_B.png)

Thus, even though Grandchild 1 can be viewed by all three users, since Child 1 cannot be viewed by user C, user C cannot see Granchild 1 (or Child 1).


In the course of developing the app for the previous evolution we realized that we would implement a testing framework moving forward. Meteor 1.3 introduced full app testing, which was perfect for us. Because we were so behind on testing and since our app was fairly large at this point, unit testing was not a feasible option. It would take a fair amount of time to use unit testing to test for features and so full app testing was a great option. However full app testing was challenging, it tested business logic that could at times be located on the client side as well as the server side. For example you could have a publication you subscribe to and a method that you call from a single page in your app, and you need tests to ensure that the publication behaves correctly on that page when you make a change via the method. So you need a deep understanding of both the client and server side code. Even though compared to traditional stacks, this is a lot easier in Meteor because it was built to run code on both sides of the stack, it is still a challenge. We realized that manual testing at this stage would still be easier and quicker than learning a new testing framework and writing all the tests. We decided to allocate more time to testing so that we would not be in the same place as before. Again looking forward this is not the best decision, but given that the technical debt we incur is soon wiped out, we decided it was in the best interest of meeting all our milestones.  

We also realized that to fix bugs we needed to know what they were and we needed to be able to replicate them. For this we needed to have a stable version of app for the previous evolution up and running. As a result we decided to spin up a new instance of the app for evolution 4, so that would could have clearly distinct versions of our app live at all times. We also decided to have a dedicated database for each instance. In addition we have the ability to add a custom domain name for the application.

Another issue we raised after the previous demo was the buggy router and reactive data source that would require a user to refresh the webpage to pull updates made to the database. We realized that our search function was causing a problem here because being a custom data source, it wasn't pulling changes from the database to populate the list of resources. The package we were using to help with search was the Search Source package, there are only a few options that Meteor has for search, so implementing our own database query as a search function was the alternative. But this would mean getting rid of the reactivity that was built into the search, which was a great feature to have. However, we did find a way to get around the issue. What we figure out was that we could use different reactive data sources for the same template using some smart client side session switching. Even though this is a temporary fix, we concluded that the technical dept would be worth it.

There were some UI bugs that were discovered in the demo as well. The white space in the email field for login has been trimmed, the date field in the reservation field has a default date, etc. Another issue we have been working on is the ability to view the reservation on a selection of resources at a specified timeline. We got really close to completing this implementation. The package we used to display the timeline makes implementing this feature extremely easy. However the hurdle we faced was in designing an intuitive UX to select and display the reservations, so we currently only have it partially implemented.
