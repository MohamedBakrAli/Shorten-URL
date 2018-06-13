var  bodyParser = require('body-parser');
var  mongoose = require('mongoose');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

mongoose.connect('mongodb://test:test123456@ds159020.mlab.com:59020/shorten_url');

var SURLSchema = new mongoose.Schema({
  surl : String,
  url : String
});

var db = mongoose.model('db', SURLSchema);

  module.exports = function(app){

  app.get('/SURL',function(req, res){
    res.render('SURL', {url : ""});
  });

  // get the shorten url then go to the real url
  app.get('/SURL/:x',function(req, res){
    db.find({surl :req.params.x}, {_id : 0, url : 1}, function (err, data){
      if (err)
        throw err;
        console.log("x : " + req.params.x);

            console.log("-url is  : " + data);
            res.redirect(data[0].url);

    });
  });

  app.post('/SURL',urlencodedParser,function(req, res){
      make_SURL(req.body.URL).then((t)=> res.render('SURL',{url : t}));
  });
};


var make_SURL = async(function(read_url){
    const find_last_SURl = new Promise((resolve, reject) => {
      var cursor = db.find({},{_id : 0, surl : 1}).limit(1).sort({ $natural : -1 });
      var last;
      cursor.exec (function(err, results) {
        if (err) throw err;
        if (results.length === 0) {
          console.log("zero legth!!");
          last = "0";
        }
        else {
            //last = await (addOne_base62(results[0].surl));
            var arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            num = results[0].surl;
            if (num.length === 0)
              return "0";
            var digit = arr.indexOf(num[0]) + 1;
            var carray = Math.floor(digit / 62);
            digit = digit % 62;
            num = replace(num, 0, arr[digit]);
            for (var i = 1; i < num.length; i++){
                digit = arr.indexOf(num[i]) + carray;
                carray = Math.floor(digit / 62);
                digit = digit % 62;
                num = replace(num, i, arr[digit]);

            }
            if (carray !== 0){
              num += arr[carray];
            }
            last = num;
        }
      });
      console.log("last : ", last);
      resolve(last);
    });
    var save = (surl_save) => {Promise((resolve, reject) => {
        db({surl : surl_save , url : read_url}).save(function(err){
          if (err)
              throw(err);
          console.log("item saved !");
        });
        resolve("success");
      });
    }
    var  generated_url = await(find_last_SURl);
    console.log("$$generated_url : " + generated_url);
    var s = await(save(generated_url));
    console.log(s);
    return generated_url;
});

var replace = function (str, index ,char){
  var arr = str.split("");
  arr.splice(index, 1, char);
  return arr.join("");
};

var addOne_base62 = (num) => {Promise((resolve, reject) => {
      console.log("###########: ", num);
      var arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (num.length === 0)
        return "0";
      var digit = arr.indexOf(num[0]) + 1;
      var carray = Math.floor(digit / 62);
      digit = digit % 62;
      num = replace(num, 0, arr[digit]);
      for (var i = 1; i < num.length; i++){
          digit = arr.indexOf(num[i]) + carray;
          carray = Math.floor(digit / 62);
          digit = digit % 62;
          num = replace(num, i, arr[digit]);

      }
      if (carray !== 0){
        num += arr[carray];
      }
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
      console.log("%% : ", num);
      resolve(num);
  });
}
