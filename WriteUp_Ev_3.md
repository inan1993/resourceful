# Evolution 3 - Write Up

### Retrospective


- Identify Good design choices
- Identify Bad design choices
- Did the design decisions effect the them and how?
- What would you have done differently



### Analysis

- Justify current design decisions.
- How will these decisions help in the future?
- Identify weaknesses and strengths?
- How would you fix the weaknesses in the future?

------------
- Grammar and writing.
- Organization and neatness.
- Supplementary aid (diagrams, images, charts...)



--------------

--------------


We had to switch from a 'blacklist' style permission system to a more group-based approach, as the requirements of the third evolution were not at all conducive to our original system. The groups component needed to be more versatile. 
In our previous designs we had not fully implemented the email capacity of the site, and in this evolution it became clear that we needed to revisit emails. A functioning email system is essential to approving and changing reservations so we had to get an email server running that could send emails many times per minute to the appropriate addresses. We had to cover many edge cases with this system that required the application of thorough logic, and in this we were successful.

This current design is a departure from a basic CRUD app, as multiple resources are now able to be reserved under single reservations, and we had to implement and elaborate approval system for reservations. At the core, the operations on the database remain the same, but now there are intermediate stages in between user making a reuest and the CRUD calls being made on the database.


A design decision we made that effected our ability to imeplement Duke *OAuth* was to use the account-oauth meteor package. By using the default package and not writing our own login console we were at the mercy of the feature available through the package. The package made it easy to use external authentication from google, facebook and twitter. But to use a custom external authenitcation service we needed to write our own login handler. It was not trivial to simply go back and just write our own login function because using the account-oauth package meant that our user creation (in the database) was closely tied to this. Another thing we did not consider that the package was relatively new and so there was very little support for it and so writing the loginHandler was not easy, it required a lot of debugging and testing. Our current design gets back a authenticated netid from the Duke OAuth2 service and simply checks if the user exists in the user database. If it doesn't contain the user, he is added and then logged into the app with a resume token. This may effect the permissions of (externally authenticated) users in the future because when adding the authenticated netIds into the database we are not creating the users the same way the account-oauth meteor package is.


We also had a lot of problems with *hosting* and deloying the app. We made the decision of using Meteor's free hosting to host our meteor app. However we didn't realize that there was a time limit on the hosting which makes sense, and our free hosting account recently expired. We could have simply registered another account and continued with their Galaxy environment. However we decided to move away from this temporary measure and use an actual deployment platform (PaaS). We chose AWS at first but we had a problem with the versioning of our packages. We then decided to use Heroku. However this didn't work with out meteor app as well, after some digging around we found that the Heroku buildpacks tht were available for Meteor were not compatible with the new version of Meteor that had be released a couple of days ago. So to use AWS or Heroku we would have to use an older version of Meteor. We were not okay with this since it might deprecate some of the packages whose feature we are currently utilizing. We then found a service called Modulus that worked with our app. However again here we have only $15 worth of free credits. An negative effect of not having a fixed domain is that our redirect URL for the Duke OAuth login keeps changing. And because the redirect URL must be approved each time it is changed we could not get our newest URL approved in time for the demo even though the feature worked. Looking back we should have deployed our app on a Duke machine which we could set up as per our requirements, and was free to use. We should not have shyed away from the extra work of setting up a custom environment. However I am still not convinced that that would be more efficient since there is not a lot of support for setting up your own server for hosting Meteor apps.

We also recently realized that *testing* is slowly becoming a more vital part of the application. The bigger and more complex the app gets the greater the need is for testing. Previously, till before Evolution 3, we had basic features which could be tested manaully and there were only a few edge cases that needed to be checked. We did not feel the need to spend the time on implementing a testing framework for our app since we would yield a much higher return on time invested if we spent it on implementing new features and cleaning up our code base. But as new requirements are added we have had to go back and change some parts of the code. Not having tests implemented has cost us precious time now, because changing old code breaks certain functionality and we need to spend additional hours debugging to find these bugs. Whereas if we had our testing framework we would know as soon as a change cause a bug and we would be able to correct it. Also there are now numerous more edge cases that cannot be as easily tested, and require non-trivial effore and time to perform. These could be so much more robust, extensive and faster if they were automated. We have decided to assign one person to testing for the future evolution. Also with the new version release of Meteor there has been an announcement in new testing features and improvement in testing modules. We require further research to decide what the trade-offs are between the various testing frameworks we can use. However the new unit-testing and integration-testing modules released look promising. The full-app test mode is especially interesting, which makes it easier to write integration tests for the entire stack. This testing will also help us test the reactivity of our app which may help us finally figure out why our datasource is acting so strangely. 
