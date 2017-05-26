if(!addEventListener){
    alert('请更新浏览器');
}
var parallax = {

      init: function(){

        this.$_ = $('.section');
        this.ov = $('.Frank-img').height() / 2;
        this.bindEvent();

      },
      bindEvent: function(){

        var _self = this;

        $(window).scroll(function(){
          _self.addListener($(window).scrollTop());
        })

      },

      addListener: function(){

        var vh = $(window).scrollTop() / this.ov;
        (vh >= 1) ? this.opacityT(vh) : this.opacityE(vh);

      },

      opacityT: function(){

        $('body').addClass('reg');
        parallax.$_.css('opacity','1');
      },

      opacityE: function(vh){

        $('body').removeClass('reg');
        parallax.$_.css('opacity',vh);
        
      }
    }

    parallax.init();