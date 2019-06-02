// AWS IoT DeviceSDKの利用
var awsIot = require('aws-iot-device-sdk');
// Alexa Skill Kit for Node.jsの利用
var Alexa = require('alexa-sdk');

// 秘密鍵、証明書などの設定
var device = awsIot.device({
  keyPath: './certs/private.pem.key',
  certPath: './certs/certificate.pem.crt',
  caPath: './certs/AmazonRootCA1.pem',
  clientId: 'MyNowThing-Push',
  host: 'a134mvfaxzdj9i-ats.iot.ap-northeast-1.amazonaws.com'
});

const calliot = function (value, resmessage) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      device.publish('topic_1', value, (err) => {
        if (err) {
          reject(err);
        }
        resolve(resmessage);
      });
    }, 1);
  });
};

const Forward = {
  'Forward': function () {
    calliot('1', '発進します。').then((result) => {
      this.response.speak(result);
      this.emit(':responseReady');
    }).catch((err) => {
      console.log(err);
      this.response.speak('失敗しました。');
      this.emit(':responseReady');
    });
  }
};

const Stop = {
  'Stop': function () {
    calliot('0', '停止します。').then((result) => {
      this.response.speak(result);
      this.emit(':responseReady');
    }).catch((err) => {
      console.log(err);
      this.response.speak('失敗しました。');
      this.emit(':responseReady');
    });
  }
};

const Reverse = {
  'Back': function () {
    calliot('2', 'バックします。').then((result) => {
      this.response.speak(result);
      this.emit(':responseReady');
    }).catch((err) => {
      console.log(err);
      this.response.speak('失敗しました。');
      this.emit(':responseReady');
    });
  }
};

exports.handler = function (event, context, callback) {
  device.on('connect', () => {
    console.log('connect');
  });

  var alexa = Alexa.handler(event, context);

  alexa.appId = process.env.APP_ID;
  alexa.registerHandlers(Forward);
  alexa.registerHandlers(Reverse);
  alexa.registerHandlers(Stop);
  alexa.execute();
};
