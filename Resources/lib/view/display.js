(function() {
  var win = Titanium.UI.currentWindow;
  win.backgroundColor = '#e3ecff';

  // load joli library and models definition file
  Ti.include('/lib/vendor/joli.js/joli.js');
  Ti.include('/lib/vendor/joli.api.js/joli.api.js');
  Ti.include('/lib/model/models.js');

  var people = models.people.findOneById(win.people_id);

  if (people) {
    win.setTitle(people.getFullName());

    var tableview = Titanium.UI.createTableView({
      minRowHeight:50,
      editable: false,
      movable: false,
      separatorColor: 'transparent'
    });
    var row = Ti.UI.createTableViewRow({
      className:'row',
      hasChild: false,
      height:'auto',
      selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
    });

    // add the user's picture
    var image = Titanium.UI.createImageView({
    	canScale: true,
    	height: 80,
    	image: people.get('picture_url'),
     	left: 10,
     	top: 10,
    	width: 80
    });
    row.add(image);

    var nameLabel = Titanium.UI.createLabel({
      font: { fontSize:16, fontWeight: 'bold' },
      height:42,
      left:105,
      text: people.getFullName() + '(' + people.get('id') + ')',
      textAlign:'left',
      top:10,
      width:'auto'
    });
    row.add(nameLabel);

    if (people.get('company_name')) {
      var companyLabel = Titanium.UI.createLabel({
        font: { fontSize:16 },
        height:42,
        left:105,
        text: people.get('company_name'),
        textAlign:'left',
        top:26,
        width:'auto'
      });
      row.add(companyLabel);
    }

    // @TODO : add the other informations

    // display the view
    tableview.setData([row]);
    win.add(tableview);
  } else {
    alert('Problem: people #' + win.people_id + ' not found. Please contact the application developer.');
  }
})();