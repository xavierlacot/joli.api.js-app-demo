(function(){
  // load joli library and models definition file
  Ti.include('/lib/vendor/joli.js/joli.js');
  Ti.include('/lib/vendor/joli.api.js/joli.api.js');
  Ti.include('/lib/model/models.js');
  joli.models.initialize();

  // initialize the app
  Ti.include('/config/initialize.js');

  // load our app and execute it
  Ti.include('/lib/view/app.js');
  app.execute();
})();