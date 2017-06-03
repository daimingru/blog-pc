var userlist = {

      init: function(){

      },
      bindEvent: function(){

        var _self = this;

        $(window).scroll(function(){
          _self.addListener($(window).scrollTop());
        })

      }
    }

userlist.init();
