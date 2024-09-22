const WaafiPay = require('waafipay-sdk-node');
const moment = require('moment-timezone');
const waafipay = new WaafiPay.API(
  process.env.API_KEY,
  process.env.APIUSERID,
  process.env.MERCHANTUID, 
  { testMode: true }
);


const preAuthorizeCancel = (params) => {
    return new Promise((resolve, reject) => {
      waafipay.preAuthorizeCancel(params, (error, body) => {
        if (error) {
          return reject(error);
        }
        resolve(body);
      });
    });
  };
  
  const preAuthorize = (params) => {
    return new Promise((resolve, reject) => {
      waafipay.preAuthorize(params, (error, body) => {
        if (error) {
          return reject(error);
        }
        resolve(body);
      });
    });
  };
  
  const preAuthorizeCommit = (params) => {
    return new Promise((resolve, reject) => {
      waafipay.preAuthorizeCommit(params, (error, body) => {
        if (error) {
          return reject(error);
        }
        resolve(body);
      });
    });
  };


  

module.exports = {
    preAuthorizeCancel,
    preAuthorize,
    preAuthorizeCommit
    };


