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

Router.route('/item1',  {
  name :"homeItem1"
});

Router.route('/item2',  {
  name :"homeItem2"
});