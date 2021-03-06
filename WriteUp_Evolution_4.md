##Team Resourceful
###Evolution 4

####Hierarchy Requirement Specificaion
For approaching the requirement for hierarchical resources, we took the approach that visibility is limited to the parent resource. That is, if a child of a resource can be viewed by a user but the parent resource cannot be viewed by the user, then the user will not see the child nor the parent in the tree. See the graphical example here: ![Hierarchy Example](http://imgur.com/efAglyo.png)

There are three users A, B, and C. The three users have view priveleges for all the resources except Child 2, which only A and B have view privileges for. Thus, user C will have the following view of the resources:

![Hierarchy Example](http://imgur.com/kUJwuzv.png)

while users A and B will see the following:

![Hierarchy Example](http://imgur.com/4UXUwIW.png)

Thus, even though Grandchild 1 can be viewed by all three users, since Child 1 cannot be viewed by user C, user C cannot see Granchild 1 (or Child 1).

In implementation, a recursive method for identifying the tree relationship a user should see easily follows this protocol. Beginning at a parent, method traverses the children that it can view. 

####Testing and Fixing Issues

In the course of developing the app for the previous evolution we realized that we would implement a testing framework moving forward. Meteor 1.3 introduced full app testing, which was perfect for us. Because we were so behind on testing and since our app was fairly large at this point, unit testing was not a feasible option. It would take a fair amount of time to use unit testing to test for features and so full app testing was a great option. However full app testing was challenging, it tested business logic that could at times be located on the client side as well as the server side. For example you could have a publication you subscribe to and a method that you call from a single page in your app, and you need tests to ensure that the publication behaves correctly on that page when you make a change via the method. So you need a deep understanding of both the client and server side code. Even though compared to traditional stacks, this is a lot easier in Meteor because it was built to run code on both sides of the stack, it is still a challenge. We realized that manual testing at this stage would still be easier and quicker than learning a new testing framework and writing all the tests. We decided to allocate more time to testing so that we would not be in the same place as before. Again looking forward this is not the best decision, but given that the technical debt we incur is soon wiped out, we decided it was in the best interest of meeting all our milestones.  

We also realized that to fix bugs we needed to know what they were and we needed to be able to replicate them. For this we needed to have a stable version of app for the previous evolution up and running. As a result we decided to spin up a new instance of the app for evolution 4, so that would could have clearly distinct versions of our app live at all times. We also decided to have a dedicated database for each instance. In addition we have the ability to add a custom domain name for the application.

Another issue we raised after the previous demo was the buggy router and reactive data source that would require a user to refresh the webpage to pull updates made to the database. We realized that our search function was causing a problem here because being a custom data source, it wasn't pulling changes from the database to populate the list of resources. The package we were using to help with search was the Search Source package, there are only a few options that Meteor has for search, so implementing our own database query as a search function was the alternative. But this would mean getting rid of the reactivity that was built into the search, which was a great feature to have. However, we did find a way to get around the issue. What we figure out was that we could use different reactive data sources for the same template using some smart client side session switching. Even though this is a temporary fix, we concluded that the technical debt would be worth it, especially considering as this was the last evolution.

There were some UI bugs that were discovered in the demo as well. The white space in the email field for login has been trimmed, the date field in the reservation field has a default date, etc. Another issue we have been working on is the ability to view the reservation on a selection of resources at a specified timeline. We got really close to completing this implementation. The package we used to display the timeline makes implementing this feature extremely easy. However the hurdle we faced was in designing an intuitive UX to select and display the reservations, so we currently only have it partially implemented.

####Design Decisions

From a design perspective, we chose to implement the parent hierarchy by only allowing a user to set a single parent for an individual resource.  While this means the user must create the hierarchy in a top down order, it also prevents the accidental introduction of a cycle into the tree, unless the user specifically goes back to edit the tree to make a cycle (which is checked for and disallowed).  The tree was drawn with a JQuery plugin called JQTree that greatly simplified the task at hand.  This was a great example of a good time to use a package - the package is well established, documented, and maintained, and handled a simple task that focused primarily on UI.  Because of this, there was no deep integration with our database or our code, and few places to run into major problems.

Our previous design choices made the implementation of limited and unlimited resources relatively easy.  We ended up only needing to add a database field to check how many reservations were allowed, since our code was already flexible enough to handle multiple reservations.  We also had to change how our app checked for reservations it needed to remove when another reservation was approved, since that code was written with the assumption that a resource only had one reservation at a time.  This also came together well when we implemented the tree view, since reserving all the resources was the same sort of reservation as normal, just with more resources.  This step could have been very convoluted had we made more assumptions during our development of evolution 3, but was made much easier by careful design decisions that separated out our assumptions.

On the other hand, we made some bad design decisions this evolution because we knew we could stomach it as it is our final evolution.  For one, our old code to check for the end of reservations is still a polling system - every minute, a scheduled task runs to remove expired reservations.  In a real system, running code every minute that needs to cycle through every reservation in the system is an unnecessarily resource intensive process.  A better alternative would have been for us to simply track the start time of a reservation, and schedule a single task to run on just that reservation at its start time to see if it had been approved.  This would scale significantly better with the size of the system, but adds significant complexity - if you update the start time of a reservation, for example, you now need to run a server side process to reschedule the cleanup task.  For our small system, this choice was still sustainable in this evolution - in the real world, it might not have been.

Our group had much better time management this evolution, and was able to complete the tasks with enough time for testing.  While this may not be a design choice persay, the improved group dynamics made this an evolution where we were more confident in our end product.  We also were able to work together to fix old bugs, which greatly improved performance of the software.

####Weaknesses and Strengths

One of the strongest points of our current codebase is that it is modular - functions are well-segregated, and the code for a single function generally appears in the same place.  This makes integrating new parts and understanding the code easier.

However, our code could still use a large refactoring.  As we discussed this semester, rather than do a full rewrite of the program, we would likely need to sit down and remove a few sections of duplicated code, refactor the code into a greater number of files with more descriptive filenames, and add a lot of comments.  Since Meteor 1.3 introduced new conventions, we would also refactor so that these were in place.

Another weakness in our code is in its dependence on third party libraries, as we have mentioned in the past few writeups.  Going forward, should these packages not be maintained, we could see security vulnerabilities, unfixed bugs, or even incompatibility with new versions of Meteor.  This weakness is also a strength, though - third party packages enable faster development, and, when you select the right ones, offload the responsibility for simple tasks to someone who has done them better and devoted more time than you could.  

Finally, I would like to again comment on our use of IronRouter as a design choice.  Having now worked with FlowRouter, it is objectively better - it enables the use of authenticated routes, which would remove about half the code from our router file, and leaves template rendering to a separate template rendering package, Blaze.  By well-segregating these two tasks, FlowRouter reduces bugs common in IronRouter and gives the user a clearer view of exactly what their code will do.  This is an allegory for our project - in the beginning, we had a convoluted design, which made us inflexible to changes in the code.  But over time, we better separated our code and its tasks, and this more modular design made our code clearer, more efficient, and easier to work with.

####Contributions

Greg McKeon: completed requirements 1(a), 1(b), 1(c) on only the local accounts, 1(d), 1(e), 1(f), 2(a), 2(b), 2(c), 2(d), 2(e), 2(f), 3(a), 3(b), 3(c), 5(a), 5(b), 6(a), 6(b), 6(c), 6(d), 6(e) except for the email, 7(a), 7(b), 7(c), 8(a), 8(b), 8(c), 8(d), 8(e).

Inan: API, OAuth, User profile, Group permissions, Calender view of resources, Depoyment and Testing, Search, Routing, Data Source, automated/scheduled email setup, bug fixes, UI. Worked on design decisions and planning.

Sharrin Manor: worked on OAuth, API, testing, the write-ups. 

TC Dong: Email service.
