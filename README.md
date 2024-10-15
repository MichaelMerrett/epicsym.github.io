https://michaelmerrett.github.io/epicsym.github.io/

Steps to manually use levels.csv file:

A. Each level is seperated by an empty line (Ensure line 1 is empty as well)
    Make sure dynamic objects are listed after others so that they appear on top of static objects

B. Level format is as follows (By line)
    1. Level name
    2. Level subjects, seperated by a comma and a space
    3. Level difficulty
    4. Level description
    5+. Objects
    
C. Object format is as follows (By comma space seperated value)
    1. Object name
    2. Object type (Box, Ramp, Pulley)
    3. X Coordinate
    4. Height off of the ground
    5. Physical width
    6. Physical height
    7. Mass

D. Assigning relavent information
    Any piece of data that an object uses can be given, or a user input
    If a data piece is given, it means its something the user needs to use to get the solution of the level
    If a data piece is an input, it means its something the user has to solve for using the given data
    Steps to assign relevant information can be found in the next two sections (E and F)

E. Assigning given values (Given values use ':' as seperators)
    1. Given value's descriptor
    2. Given value
    3. Given value's units

F. Assigning input values (Input values use ';' as seperators)
    1. Input value's descriptor
    2. Input value
    3. Correct value
    4. Precision (Ex. a precision of 0.1 means the user's answer can be 0.1 off the correct value)
    5. Minimum
    6. Maximum
    7. Step (How much should the value change by when arrow buttons are pressed)

G. Assigning extra givens
    Givens that aren't tied to any one object (such as time) can be stated in this section.
    Uses the same syntax as assigning object given values
    All extra given values should be in the second last line of the level data

H. Assigning solution data
    (TBD)
