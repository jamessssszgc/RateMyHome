Include names of your team members Member 1: Jun Chen (1002073196) Member 2: Guanchen Zhang (1002073132) Member 3: Yufeng Li (1001408309) Member 4: Songlin Liu (1002616010)

# Website detail
Our first view is a simple welcome. The user can use the search bar to allocate the center of near-by searching and login or register on the top right corner. Also, the announcement posted by administrator will be updated with in 3 seconds. The top navigation bar always collapses to a view fitting mobile screen.

After specifying the center of searching, the user will be on the second view. In this view, the map shows the locations of places found by google API followed by the place image and the users can specify the radius and home type of searching. When clicking at the marker on map, screen will automatically scroll to corresponding place holder. Shrinking the screen size will lead to a hidden of place image and a decrease in font size. Clicking the top button at the bottom-left corner will scroll the screen back to top.

Clicking the specific location on the side-bar can take the user to the third view. Here is the comment and ratings, and users can write their own and delete it. The newly added comment will be displayed one the review area. When shrinking the screen to a smaller size, rating statistics (number of selection) will be hidden. There is a navigation bar at the bottom of the screen which helps users navigate through this detail page to make the selected area show on top of the screen. The bottom navigation bar can also collapse when screen size decreases.
If the user is logged in, he/she is able to post a comment of this place. A logged in user can delete his/her own comment by clicking the delete button. One is blocked to delete other's review. If a user has already post a review of this place, when he/she is submitting a new form for review, his/her old comment will be updated.


To manipulate annoucements, use the following commands:
curl --header 'Content-Type: application/json' -XPOST -d '{"message":"This is our website"}' http://rate-my-home.herokuapp.com/api/messages
curl -XGET http://rate-my-home.herokuapp.com/api/messages
curl -XDELETE http://rate-my-home.herokuapp.com/api/messages/_id

# API
## get /
redirect to /home

## get /home
Render the first page to users along with the latest admin message if the user is logged in.

## get /detail/:placeid
Get the specific place details which contain the place picture, a description, users' review. If the user is logged in, he/she is able to post his/her own review along with the rating. 


## post /detail/:placeid/comment
Post the review along with rating of a place specific by placeid


## delete /detail/:placeid/:userid
Delete the user's review of a place from database


## put /detail/:placeid/:userid
Update the user's review of a place.


## get /api/messages
Get messages posted by admin. Each logged in user is able to view the latest message in real time.

## post /api/messages
Admin post a message to database

## delete /api/messages/:mid
Admin can delete a specific message by _id
