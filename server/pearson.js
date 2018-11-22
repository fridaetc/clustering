exports.get = function(allRatings, userRatings, userId) {
  let users = [],
  prevUser = allRatings[0].user,
  sum1 = 0, sum2 = 0, sum1sq = 0, sum2sq = 0, sum = 0, count = 0;

  for (let i = 0; i <= allRatings.length; i++) { //Go through all users ratings
    let rating = allRatings[i];

    if(prevUser !== userId) { //Dont compare with youself
      if(i == allRatings.length || (prevUser && prevUser !== rating.user)) { //if next user
        let score = sum - (sum1 * sum2 / count);
        let score2 = Math.sqrt((sum1sq - Math.pow(sum1, 2) / count) * (sum2sq - Math.pow(sum2, 2) / count));
        users.push({id: prevUser, score: score / score2});

        //reset
        sum1 = 0;
        sum2 = 0;
        sum1sq = 0;
        sum2sq = 0;
        sum = 0;
        count = 0;
      }
    }

    if(i == allRatings.length) {
      break;
    }

    if(rating.user !== userId) { //Dont compare with youself
      userRatings.forEach(function(userRating, j) { //compare with logged in user
        if(rating.movie == userRating.movie) { //if users has rated same movie
          sum1 += userRating.rating;
          sum2 += rating.rating;
          sum1sq += Math.pow(userRating.rating, 2);
          sum2sq += Math.pow(rating.rating, 2);
          sum += userRating.rating * rating.rating;
          count++;
        }
      });

    }

    prevUser = rating.user;
  }

  users.sort(function(userA, userB){return userB.score > userA.score});
  return users;
}
