(function() {
  var win = Titanium.UI.currentWindow;
  win.backgroundColor = '#e3ecff';
  win.setTitle('All contacts');

  // load joli library and models definition file
  Ti.include('/lib/vendor/joli.js/joli.js');
  Ti.include('/lib/joli.api.js');
  Ti.include('/lib/model/models.js');

  // load the associated controller
  Ti.include('/lib/controller/people.js');

  // create a table view
  var peoples = controller.buildRows();

  var search = Titanium.UI.createSearchBar({
  	showCancel:false
  });
  var tableview = Titanium.UI.createTableView({
  	data:peoples,
  	editable:true,
  	filterAttribute:'title',
  	moveable:false,
  	rowBackgroundColor:'white',
  	scrollable: true,
  	search: search
  });

  // add an event listener for displaying the detail of a people
  tableview.addEventListener('click', function(e) {
    // show the people
    if (e.row.people_id) {
      controller.show(e.row.people_id);
    }
  });

  // update the tableview content when new records are saved using joli api
  Ti.App.addEventListener('joli.records.saved', function(event) {
    if (event.table == 'people') {
      tableview.data = controller.buildRows();
    }
  });

  // display "refresh" button on the top right of the screen
  // @TODO: improve it, use a pull to refresh
  // see http://developer.appcelerator.com/blog/2010/05/how-to-create-a-tweetie-like-pull-to-refresh-table.html
  var refresh = Titanium.UI.createButton({
  	systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
  });
  refresh.addEventListener('click', function() {
    // empty table
    models.people.truncate();

    // load the people from the service
    models.people.forceReload();
  });

  if (Ti.Platform.name == 'iPhone OS') {
  	win.rightNavButton = refresh;
  } else {
  	refresh.top = 5;
  	refresh.title = "Refresh";
  	refresh.width = 200;
  	tableview.top = 60;
  	win.add(refresh);
  }

  // add the tableview to the window
  win.add(tableview);
})();