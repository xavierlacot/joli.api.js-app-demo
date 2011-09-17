// our containing app
var app = {};

app.execute = function() {
  // page background
  Titanium.UI.setBackgroundColor('#000');

  if (Titanium.Platform.name != 'android') {
    // show back the status bar on top of the screen
    Titanium.UI.iPhone.statusBarHidden = false;
  }

  // create tab group
  var tabGroup = Titanium.UI.createTabGroup({
    barColor: '#0c3783'
  });

  var win1 = Titanium.UI.createWindow({
      backgroundColor:'#fff',
      url: '/lib/view/list.js',
      tabBarHidden:  true,
  });
  var tab1 = Titanium.UI.createTab({
      icon:'/images/icons/people.png',
      title:'People',
      window:win1
  });

  tabGroup.addTab(tab1);

  if (Titanium.Platform.name != 'android') {
    tabGroup.open({
    	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
    });
  } else {
    tabGroup.open();
  }
};