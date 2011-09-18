// list functions
var controller = (function() {
  var api = {};

  /**
   * This builds the rows array for the tableview of the peoples list
   */
  api.buildRows = function() {
    // select the peoples from the database
    var peoples = joli.models.get('people').all({
      order: ['lastname asc', 'firstname asc']
    });

    // build the peoples list
    var data = [];
    var initial = '';

    joli.each(peoples, function(people, key) {
      var lastname = people.get('lastname') ? people.get('lastname') : '';
      var current_initial = lastname.substr(0, 1).toUpperCase();
      var row = {
        hasChild: false,
        people_id: people.get('id'),
        title: people.getFullDecoratedName()
      };

      if (initial != current_initial) {
        row.header = current_initial;
      }

      data.push(row);
      initial = current_initial;
    });

    return data;
  };

  /**
   * Opens a new window in the current tab in order to display one people
   * from its id
   */
  api.show = function(people_id) {
    var win = Titanium.UI.createWindow({
      backgroundColor:'#fff',
      url: '/lib/view/display.js',
      people_id: people_id
    });

    Titanium.UI.currentTab.open(win, {animated:true});
  };

  return api;
})();