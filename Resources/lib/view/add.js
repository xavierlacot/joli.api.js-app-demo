(function() {
  var win = Titanium.UI.currentWindow;
  win.backgroundColor = '#e3ecff';
  win.setTitle('Add new');

  // load joli library and models definition file
  Ti.include('/lib/vendor/joli.js/joli.js');
  Ti.include('/lib/joli.api.js');
  Ti.include('/lib/model/models.js');

  // load the associated controller
  Ti.include('/lib/controller/add.js');

  var scrollView = Titanium.UI.createScrollView({
  	contentHeight: 'auto',
  	contentWidth: 'auto',
  	showHorizontalScrollIndicator: false,
  	showVerticalScrollIndicator: true,
  	top: 0
  });
  var view = Ti.UI.createView({
  	borderRadius: 10,
  	height: 600,
  	layout: 'vertical',
  	top: 10,
  	width: 300
  });

  var title = Titanium.UI.createLabel({
    font: { fontSize: 30, fontWeight: 'bold' },
    height: 40,
    left: 10,
    text: 'Add a new people',
    top: 10
  });
  view.add(title);

  var container = {
    lastname: Titanium.UI.createTextField({
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
      color:'#336699',
      height: 35,
      hintText: 'Last name',
      left: 10,
      right: 10,
      top: 17
    }),
    firstname: Titanium.UI.createTextField({
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
      color:'#336699',
      height: 35,
      hintText: 'First name',
      left: 10,
      right: 10,
      top: 17
    }),
    company_name: Titanium.UI.createTextField({
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
      color:'#336699',
      height: 35,
      hintText: 'Company',
      left: 10,
      right: 10,
      top: 17
    }),
    email: Titanium.UI.createTextField({
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
      keyboardType:Titanium.UI.KEYBOARD_EMAIL,
      color:'#336699',
      height: 35,
      hintText: 'Email',
      left: 10,
      right: 10,
      top: 17
    }),
    phone: Titanium.UI.createTextField({
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
      keyboardType:Titanium.UI.KEYBOARD_PHONE_PAD,
      color:'#336699',
      height: 35,
      hintText: 'Phone number',
      left: 10,
      right: 10,
      top: 17
    })
  };
  joli.each(container, function(field, key) {
    field.addEventListener('return', function() {
    	field.blur();
    });
  });

  var button = Titanium.UI.createButton({
  	height: 40,
  	left: 10,
  	right: 10,
  	title: 'Save this user',
  	top: 25
  });

  // persist the values of the form
  button.addEventListener('click', function() {
    controller.save(controller.extractValues(container));
    win.close();
  });

  view.add(container.firstname);
  view.add(container.lastname);
  view.add(container.company_name);
  view.add(container.email);
  view.add(container.phone);
  view.add(button);
  scrollView.add(view);
  win.add(scrollView);
})();