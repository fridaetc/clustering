const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const db = require('./db/db');
const pearson = require('./pearson');

exports.cluster = function(cb) {
  readFile("db/blogdata.txt", function(rowNames, colNames, data) {
    let bestMatches = kCluster(data);
    let clusters = [];
    for (let i = 0; i < bestMatches.length; i++) {
       clusters.push([]);
      for (let j = 0; j < bestMatches[i].length; j++) {
        clusters[i].push(rowNames[bestMatches[i][j]]);
      }
    }

    cb(clusters);
  });
}

function kCluster(rows, k=5) {
  let ranges = [], clusters = [];

  for (let i = 0; i < rows[0].length; i++) {
    let min = Infinity;
    let max = 0;

    for (let j = 0; j < rows.length; j++) {
      let number = rows[j][i];
      if(number > max) {max = number};
      if(number < min) {min = number};
    }

    ranges.push([min, max]);
  }


  for(let i = 0; i < k; i++) {
    let random = [];
    for(let j = 0; j < ranges.length; j++) {
      random.push(Math.floor(Math.random() * (ranges[j][1] + 1 - ranges[j][0]) + ranges[j][0]));
    }
    clusters.push(random);
  }

  let lastMatches = null, bestMatches = [];
  for(let i = 0; i < 100; i++) {
    console.log(i);
    bestMatches = [];

    for(let m = 0; m < k; m++) { bestMatches.push([]); }

    for(let j = 0; j < rows.length; j++) {
      let bestMatch = 0,
          distance = Infinity,
          row = rows[j];

      for(let l = 0; l < k; l++) {
        let d = pearson.getDist(clusters[l], row);
        if(d < distance) {
          bestMatch = l;
          distance = d;
        }
      }

      bestMatches[bestMatch].push(j);
    }

    if(bestMatches == lastMatches) { break; }
    lastMatches = bestMatches;

    for(let m = 0; m < k; m++) {
      let avgs = new Array(rows[0].length);
      if(bestMatches[m].length > 0) {
        for (let n = 0; n < bestMatches[m].length; n++) {
          let rowIndex = bestMatches[m][n];
          let dataRow = rows[rowIndex];

          for (let o = 0; o < dataRow.length; o++) {
            avgs[o] = avgs[o] ? avgs[o] + dataRow[o] : dataRow[o];
          }
        }
        for (let p = 0; p < avgs.length; p++) {
          avgs[p] /= bestMatches[m].length;
        }

        clusters[m] = avgs;
      }
    }
  }

  return bestMatches;
}

function readFile(fileName, cb) {
  let firstRun = true, rowNames = [], colNames = [], data = [];
  let instream = fs.createReadStream(fileName);
  let outstream = new stream;
  let rl = readline.createInterface(instream, outstream);

  rl.on('line', function(line) {
    if(firstRun) {
      firstRun = false;
      colNames = line.trim().split('\t');
      colNames.shift();
    } else {
      let p = line.trim().split('\t');
      rowNames.push(p[0]);

      for(let i = 1; i < p.length; i++) {
        p[i] = parseFloat(p[i]);
      }

      p.shift();
      data.push(p);
    }
  });

  rl.on('close', function() {
    cb(rowNames, colNames, data);
  });
}
