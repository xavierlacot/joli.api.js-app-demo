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

  // Pull to refresh. Almost all of this code taken from KitchenSink
  function formatDate() {
  	var date = new Date();
  	var datestr = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();

  	if (date.getHours() >= 12) {
  		datestr += ' ' + (date.getHours() == 12 ? date.getHours() : date.getHours()-12) + ':' + date.getMinutes() + ' PM';
  	} else {
  		datestr += ' '+date.getHours() + ':' + date.getMinutes() + ' AM';
  	}

  	return datestr;
  }

  var border = Ti.UI.createView({
  	backgroundColor:"#576c89",
  	height:2,
  	bottom:0
  });
  var tableHeader = Ti.UI.createView({
  	backgroundColor:"#e2e7ed",
  	width:320,
  	height:60
  });
  tableHeader.add(border);

  var arrow = Ti.UI.createView({
  	backgroundImage:"/images/whiteArrow.png",
  	width:23,
  	height:60,
  	bottom:10,
  	left:20
  });
  var statusLabel = Ti.UI.createLabel({
  	text:"Pull to reload",
  	left:55,
  	width:200,
  	bottom:30,
  	height:"auto",
  	color:"#576c89",
  	textAlign:"center",
  	font:{fontSize:13,fontWeight:"bold"},
  	shadowColor:"#999",
  	shadowOffset:{x:0,y:1}
  });
  var lastUpdatedLabel = Ti.UI.createLabel({
  	text:"Last Updated: "+formatDate(),
  	left:55,
  	width:200,
  	bottom:15,
  	height:"auto",
  	color:"#576c89",
  	textAlign:"center",
  	font:{fontSize:12},
  	shadowColor:"#999",
  	shadowOffset:{x:0,y:1}
  });
  var actInd = Titanium.UI.createActivityIndicator({
  	left:20,
  	bottom:13,
  	width:30,
  	height:30
  });

  tableHeader.add(arrow);
  tableHeader.add(statusLabel);
  tableHeader.add(lastUpdatedLabel);
  tableHeader.add(actInd);
  tableview.headerPullView = tableHeader;

  var pulling = false;
  var reloading = false;

  function beginReloading() {
  	// just mock out the reload
  	setTimeout(endReloading,2000);
  }

  function endReloading() {
    // update the table content
    models.people.forceReload();

  	// when you're done, just reset
  	tableview.setContentInsets({top:0},{animated:true});
  	reloading = false;
  	lastUpdatedLabel.text = "Last Updated: "+formatDate();
  	statusLabel.text = "Pull down to refresh...";
  	actInd.hide();
  	arrow.show();
  }

  tableview.addEventListener('scroll', function(e) {
  	var offset = e.contentOffset.y;
  	if (offset <= -65.0 && !pulling) {
  		var t = Ti.UI.create2DMatrix();
  		t = t.rotate(-180);
  		pulling = true;
  		arrow.animate({transform:t,duration:180});
  		statusLabel.text = "Release to refresh...";
  	} else if (pulling && offset > -65.0 && offset < 0) {
  		pulling = false;
  		var t = Ti.UI.create2DMatrix();
  		arrow.animate({transform:t,duration:180});
  		statusLabel.text = "Pull down to refresh...";
  	}
  });

  tableview.addEventListener('scrollEnd', function(e) {
  	if (pulling && !reloading && e.contentOffset.y <= -65.0) {
  		reloading = true;
  		pulling = false;
  		arrow.hide();
  		actInd.show();
  		statusLabel.text = "Reloading...";
  		tableview.setContentInsets({top:60},{animated:true});
  		arrow.transform=Ti.UI.create2DMatrix();
  		beginReloading();
  	}
  });


  // display a button for adding a new people
  var addPeople = Titanium.UI.createButton({
  	systemButton:Titanium.UI.iPhone.SystemButton.ADD
  });
  addPeople.addEventListener('click', function() {
    // send to add.js
  });

  if (Ti.Platform.name == 'iPhone OS') {
  	win.rightNavButton = addPeople;
  } else {
  	addPeople.top = 5;
  	addPeople.title = "Refresh";
  	addPeople.width = 200;
  	tableview.top = 60;
  	win.add(addPeople);
  }

  // add the tableview to the window
  win.add(tableview);
})();