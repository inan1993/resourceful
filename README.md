# Resourceful LLC
### A resource reservation system for ECE 458: Engineering Software for Maintainability 

> Instructions:
- URL: https://resourceful_ev4.mod.bz/

## Team Logistics
inantainwala@gmail.com

greg.mckeon4@gmail.com

tian.chan.dong@duke.edu

sharrinmanor@gmail.com

## Introduction
Resourceful is a web-based resource reservation system built on the [Meteor](https://www.meteor.com/) platform. The premise of the application is that a company (Resourceful LLC) is in need of an internal resource management system for employees to checkout the resources they need to use.
Users of the system receive an account, search for resources they wish to reserve (server space, conference rooms, and more), reserve the resources (or be told the resource is occupied during their desired time), delete/edit their reservations after initially requesting them, and receive notifications of their upcoming reservations.
An admin can control all the users and reservations.

# API
To access the API, you first log in with a post request to https://resourceful_ev4.mod.bz/api/login with the body containing email and password parameters. On successful login, you will receive back an authToken and userId. Then for all other requests you must include the authToken and userId as header parameters (X-Auth-Token and X-Uder-Id, respectively). So for instance, to see all resources available to you, after getting the token and id from the login post request and placing them in the header field, you would send a get request to https://resourceful_ev4.mod.bz/api/resources. This will return a JSON with the information for the resources that you are allowed to view. On completion, a post request to https://resourceful_ev4.mod.bz/api/logout will deactivate the authToken. 
