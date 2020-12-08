// const https = require("https");

// async function func(year, score) {
//   let option = {
//     host: "jsonmock.hackerrank.com",
//     port: 443,
//     path: `/api/football_matches?year=${year}&team1goals=${score}&team2goals=${score}`,
//     method: "GET",
//   };
//   return new Promise((resolve, reject) => {
//     let req = https.request(option);
//     req.on("response", (res) => {
//       res.setEncoding("utf8");
//       res.on("data", (data) => {
//         resolve(data);
//       });
//     });
//     req
//       .on("error", (error) => {
//         reject(error);
//       })
//       .end();
//   });
// }
// async function solve(year, score) {
//   let res = await func(year, score);
//   res = JSON.parse(res);
//   console.log(res.total);
//   return res.total;
// }

// async function getNumDraws(year) {
//   let result = 0;
//   for (let score = 0; score <= 10; score += 1) {
//     result += await solve(year, score);
//   }
//   console.log(result);
// }

// getNumDraws(2011);

const fetch = require("node-fetch");
const apiCall = () => {
  return fetch("https://jsonplaceholder.typicode.com/users");
};
const getRes = () => {
  apiCall()
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      console.log(body);
    });
};

const init = () => {
  getRes();
  //console.log(res);
};

init();
