const express = require('express')
const app = express()
const cors = require('cors')


let info

app.use(cors({
    origin: "http://localhost:3000",  //where the request will come from
}))


var the_interval = 300;
setInterval(function() {
  GrabPrice()
}, the_interval); 


GrabPrice()
    
function GrabPrice() {


//const start = Date.now()


const https = require('https');
const crypto = require('crypto');

const host = 'trade-am.osl.com';
const key = '262a8c44-c16d-443a-81c3-6bdb374604dc';
const secret = 'LrqdScibZdS7AqzZIRKzBbjNPwFeAVDrYZb+A/Z2vW9FzGaDeFnS7bLGxD8U4qjwc07wYxJPx/5X4PQaR/wqTA==';


const response_as_json = (resolve, reject) => {
  return function(res) {
    let str = '';
    res.on('data', function (chunk) { str += chunk; });
    res.on('end', function (arg) {
        info = JSON.parse(str)
        console.log(JSON.parse(str));
      ((res.statusCode >= 200 && res.statusCode < 300) ? resolve : reject)(str ? JSON.parse(str) : '');
    });
  }
}

const gen_sig_helper = (secret, data) => {
  const secret_bytes = Buffer.from(secret, 'base64');
  return crypto.createHmac('sha512', secret_bytes).update(data).digest('base64');
}

const v4_gen_sig = (secret, method, path, expires, body_str) => {
  let data = method + path + expires;
  if (body_str) {
    data = data + body_str;
  }
  return gen_sig_helper(secret, data);
}

const v4_mk_request = (method, path, body) => {
  //console.log(`=> ${method} ${path}`);
  return new Promise((resolve, reject) => {
    const tonce = Math.floor(Date.now() / 1000) + 10;
    const body_str = JSON.stringify(body);
    const headers = {
      'api-key': key,
      'api-signature': v4_gen_sig(secret, method, path, tonce, body_str),
      'api-expires': tonce,
      'Content-Type': 'application/json'
    }
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(body_str);
    }
    const opt = { host, method, path, headers };
    const req = https.request(opt, response_as_json(resolve, reject));
    if (body) {
      req.write(body_str);
    }
    req.end();
  });
}

async function run() {
  try { await v4_mk_request('GET', '/api/v4/instrument?symbol=BTCUSD'); 
  } catch (error) {
      console.error(error);
  }
}

run();



//check runtime
//const stop = Date.now()
//console.log(`Time Taken to execute = ${(stop - start)/1000} seconds`);

}

app.get("/data", (req, res) => {
    res.json({
        name: info[0].bidPrice,
        profession: "Blockchain Developer"
    })
})

app.listen(5000)

/*
res.json({
    name: "David",
    profession: "Blockchain Developer"
})
*/