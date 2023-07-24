### TutorVerse - Tutor Finder

## Description

Finding a tutor on campus can be frustrating for students who need quick tutoring sessions from university provided tutors. To bridge this gap, there is a need for a platform to help students view all available tutors on their local campus and quickly locate them without the inconveniences of having to dig through emails or passing through chains of referrals in departments

## User Stories

**Student**

- Can select school campus community from a list
- Can signup/register for an account
- Can view list of available tutors registered on the platform
- Can easily locate a tutor on campus
- Can book tutor and be added to their waitlist
- Can view booked session(s) if available
- Can rate a tutor and write a review
- Can send a message/ping a tutor

**Tutor**

- Can signup/register for an account
- Can create and display my tutor profile
- Can create and edit my tutoring schedule
- Can ping my availability on and off
- Can share live location during working hours so students can find them
- Can receive a reminder to clock in and out when working hours start and end

#### Project Plan

# Screen Archetypes

<img src='tutorverse-client/src/assets/Tutorverse Wireframes.png' width=100%>

### WEEK 1 Tasks

- Project setup
- [x] Github repository
- [x] Database setup/connection
- [x] VS code environment setup
- Create UI for landing page
- [x] Create UI
- Can select school campus community from a list
- [x] Create UI for school selection drop-down
- [x] Implement API fetch for schools list (Third-party API requirement)
- Can signup/register for an account
- [x] Create UI for sign-up and login forms with input fields
- [x] Create data model for users table to store input fields
- [x] Handle client-side code for sign-up form submission
- [x] Create user registration POST request endpoint

- User can login
- [x] Handle login form submission on client code
- [x] Login POST request endpoint

- Week 1 tasks progress gif
  ![Gif](tutorverse-client/src/assets/TutorverseSignup.gif)

### WEEK 2 Tasks

- [x] Handle password encryption and validation
- [x] Handle authentication state and session management
- Displaying list of tutors
- [x] Design UI for Tutor Dashboard and student Dashboard
- [x] Handle saving school and role data for users in database
- [x] Tutor API for list of tutors
- [x] Fetching tutor list from API and displaying in listview

- Individual tutor
- [x] GET request for individual tutor
- [x] Individual tutor view component
- [x] Handle navigation between tutor listview

### WEEK 3 Tasks
- [x] Live-location implementation research
- [x] Update user model to save user location data
- [x] Google Maps geolocation API
- [x] MapView UI
- [x] Add markers on map for each available tutors


## THIRD-PARTY APIS

- List of US Universities: https://parseapi.back4app.com/classes/Usuniversitieslist_University?&order=name
