$(document).ready(function(){

  $('form').on('submit', function(){
      var url = $('form input');
      var LURL = {url: url.val()};
      alert(url);
      $.ajax({
        type: 'POST',
        url: '/SURL',
        data: LURL,
        success: function(data){
          alert ("the data is : "+data);
        }
      });
      return false;
  });

});
