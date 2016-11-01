Router.configure({
    layoutTemplate : 'layout',
    loadingTemplate :'loading',
    notFoundTemplate :'notfound'
});


Router.route('/',  {
  name :"homeIndex",
  data : function(){
    return {
        message :  " Welcome to Ambula"
    }
  }
});