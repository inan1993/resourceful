# Evolution 3 - Write Up

### Retrospective


- Identify Good design choices
- Identify Bad design choices
- Did the design decisions effect the them and how?
- What would you have done differently
- 

We had to switch from a 'blacklist' style permission system to a more group-based approach, as the requirements of the third evolution were not at all conducive to our original system. The groups component needed to be more versatile. 
In our previous designs we had not fully implemented the email capacity of the site, and in this evolution it became clear that we needed to revisit emails. A functioning email system is essential to approving and changing reservations so we had to get an email server running that could send emails many times per minute to the appropriate addresses. We had to cover many edge cases with this system that required the application of thorough logic, and in this we were successful.

### Analysis

This current design is a departure from a basic CRUD app, as multiple resources are now able to be reserved under single reservations, and we had to implement and elaborate approval system for reservations. At the core, the operations on the database remain the same, but now there are intermediate stages in between user making a reuest and the CRUD calls being made on the database. 
- Justify current design decisions.
- How will these decisions help in the future?
- Identify weaknesses and strengths?
- How would you fix the weaknesses in the future?


------------
- Grammar and writing.
- Organization and neatness.
- Supplementary aid (diagrams, images, charts...)
