exports.getDist = function(aArr, bArr) {
  let sum1 = 0, sum2 = 0, sum1sq = 0, sum2sq = 0, sum = 0, count = 0;

  aArr.forEach(function(a, i) {
    bArr.forEach(function(b, j) {
      if(i == j) {
        sum1 += a;
        sum2 += b;
        sum1sq += Math.pow(a, 2);
        sum2sq += Math.pow(b, 2);
        sum += a * b;
        count++;
      }
    });
  });

  let score = sum - (sum1 * sum2 / count);
  let score2 = Math.sqrt((sum1sq - Math.pow(sum1, 2) / count) * (sum2sq - Math.pow(sum2, 2) / count));
  return 1 - score / score2;
}
