##Team Resourceful
###Evolution 4

####Hierarchy Requirement Specificaion
For approaching the requirement for hierarchical resources, we took the approach that visibility is limited to the parent resource. That is, if a child of a resource can be viewed by a user but the parent resource cannot be viewed by the user, then the user will not see the child nor the parent in the tree. See the graphical example here: ![Hierarchy Example](/hierarchy1.png)

There are three users A, B, and C. The three users have view priveleges for all the resources except Child 2, which only A and B have view privileges for. Thus, user C will have the following view of the resources:

![Hierarchy Example](/hierarchy_C.png)

while users A and B will see the following:

![Hierarchy Example](/hierarchy_A_B.png)

Thus, even though Grandchild 1 can be viewed by all three users, since Child 1 cannot be viewed by user C, user C cannot see Granchild 1 (or Child 1).
