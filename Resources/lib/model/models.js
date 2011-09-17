joli.connection = new joli.Connection('joli-demo-2');

var models = (function() {
  var m = {};

  m.people = new joli.apimodel({
    table: 'people',
    columns: {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      firstname:          'TEXT',
      lastname:           'TEXT',
      company_name:       'TEXT',
      email:              'TEXT',
      phone:              'TEXT',
      picture_url:        'TEXT'
    },
    objectMethods: {
      getFullDecoratedName: function() {
        return this.get('firstname') + ' ' + this.get('lastname').toUpperCase();
      },

      getFullName: function() {
        return this.get('firstname') + ' ' + this.get('lastname');
      }
    },
    url: 'http://local.example.com/api/people.json'
  });

  // table_updates model (required by joliapi)
  m.table_updates = new joli.model({
    table: 'table_updates',
    columns: {
      id:                 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name:               'TEXT',
      updated_at:         'TEXT'
    }
  });

  return m;
})();