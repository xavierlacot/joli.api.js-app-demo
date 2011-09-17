joli.hideIndicator = function() {
  if ((Titanium.Platform.name != 'android') && Titanium.UI.currentWindow) {
  	Titanium.UI.currentWindow.setToolbar(null,{animated:true});
  }
};

joli.showIndicator = function() {
  if ((Titanium.Platform.name != 'android') && Titanium.UI.currentWindow) {
    var toolActInd = Titanium.UI.createActivityIndicator();
  	toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
  	toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
  	toolActInd.color = 'white';
  	toolActInd.message = 'Chargement...';
  	Titanium.UI.currentWindow.setToolbar([toolActInd],{animated:true});
  	toolActInd.show();
  }

  if ((Titanium.Platform.name == 'android') && Titanium.UI.currentWindow) {
    var toolActInd = Titanium.UI.createActivityIndicator({
    	bottom:10,
    	height:50,
    	width:10
    });
    Titanium.UI.currentWindow.add(toolActInd);
  	toolActInd.show();
  	toolActInd.message = 'Loading...';

  	setTimeout(function() {
  		toolActInd.hide();
  	}, 1000);
  }
};

joli.saveRecord = function(table, items) {
  var i = 0;
  var new_count = 0;
  items = joli.jsonParse(items);
  table = joli.models.get(table);

  while (i < items.length) {
    if (!table.exists(items[i].id)) {
      table.newRecord(items[i]).save();
      new_count++;
    }

    i++;
  }

  if (new_count > 0) {
    Ti.App.fireEvent('joli.records.saved', {
      table: table.table,
      nb_new: new_count
    });
  }
};

joli.apimodel = function(options) {
  var defaults = {
    updateTime: 86400, // 1 day
    url: null
  };

  joli.extend.call(this, joli.model, options);
  joli.setOptions.call(this, options, defaults);
  this._api = new joli.apimodel.api({model: this});
};

joli.apimodel.prototype = {
  all: function(constraints) {
    var api_constraints = constraints;
    var where = constraints.where;
    var api_where = {};

    joli.each(api_constraints.where, function(value, field) {
      var field_parts = field.toString().split(' ');

      if (field_parts.length == 1 || (field_parts[1] == '=')) {
        api_where[field_parts[0]] = value;
      }
    });

    api_constraints.where = api_where;
    var query_string = this.getQueryString(api_constraints);
    this.conditionnalUpdate(query_string);
    constraints.where = where;
    return this.parent.all(constraints);
  },

  conditionnalUpdate: function(query_string) {
    if (!query_string || ('null' == query_string) || (null == query_string)) {
      query_string = '';
    }

    if (this.hasToUpdate(query_string)) {
      this._api.get(query_string);
      this.markUpdated(query_string);
    }
  },

  count: function(constraints) {
    var api_constraints = constraints;
    var where = constraints.where;
    var api_where = {};

    joli.each(api_constraints.where, function(value, field) {
      var field_parts = field.toString().split(' ');

      if (field_parts.length == 1 || (field_parts[1] == '=')) {
        api_where[field_parts[0]] = value;
      }
    });

    api_constraints.where = api_where;
    var query_string = this.getQueryString(api_constraints);
    this.conditionnalUpdate(query_string);
    constraints.where = where;
    return this.parent.count(constraints);
  },

  findBy: function(field, value) {
    var query_string = null;

    if (field && value) {
      var where = {};
      where[field] = value;
      query_string = this.getQueryString({where: where});
    }

    this.conditionnalUpdate(query_string);
    return this.parent.findBy(field, value);
  },

  findOneBy: function(field, value) {
    var query_string = null;

    if (field && value) {
      var where = {};
      where[field] = value;
      query_string = this.getQueryString({where: where});
    }

    this.conditionnalUpdate(query_string);
    return this.parent.findOneBy(field, value);
  },

  forceReload: function(query_string) {
    if (!query_string || ('null' == query_string) || (null == query_string)) {
      query_string = '';
    }

    this._api.get(query_string);
  },

  getQueryString: function(constraints) {
    var query_string = null;
    var query_string_params = [];

    if (constraints.where) {
      joli.each(constraints.where, function(value, key) {
        query_string_params.push(key + '=' + value);
      });
    }

    if (query_string_params.length > 0) {
      query_string = '?' + query_string_params.join('&');
    }

    if (!query_string || ('null' == query_string) || (null == query_string)) {
      query_string = '';
    }

    return query_string;
  },

  hasToUpdate: function(query_string) {
    if (query_string && (query_string.charAt(0) != '?')) {
      query_string = '?' + query_string;
    }

    if (!query_string || ('null' == query_string) || (null == query_string)) {
      query_string = '';
    }

    var now = new Date().getTime();
    var last_update = new joli.query()
      .select('updated_at')
      .from('table_updates')
      .where('name = ?', this.table + query_string)
      .order('updated_at desc')
      .execute();

    if (last_update.length == 0) {
      return true;
    }

    return (last_update[0].updated_at <  now - this.options.updateTime * 1000);
  },

  markUpdated: function(query_string) {
    if (query_string && (query_string.charAt(0) != '?')) {
      query_string = '?' + query_string;
    }

    if (!query_string || ('null' == query_string) || (null == query_string)) {
      query_string = '';
    }

    var now = new Date().getTime();
    var q = new joli.query()
      .insertInto('table_updates')
      .values({
        name:        this.table + query_string,
        updated_at:  now
      });
    q.execute();
    Ti.App.fireEvent('joli.records.markedUpdated', {
      table: this.table
    });
  }
};

joli.apimodel.api = function(options) {
  this.model = options.model;
  this.xhrCallCompleted = false;
};

joli.apimodel.api.prototype = {
  call: function(method, params) {
    try {
      joli.showIndicator();
      this.xhrCallCompleted = false;
      this.xhr = Titanium.Network.createHTTPClient();
      this.xhr.apimodel = this.model.table;
      var url = this.getUrl(params);
      Titanium.API.log('info', 'loading url ' + url);

      this.xhr.onload = function() {
        joli.saveRecord(this.apimodel, this.responseText);
        joli.hideIndicator();
        return true;
      };

      if (Titanium.Platform.name != 'android') {
        this.xhr.open(method, url, true);
      } else {
        this.xhr.open(method, url, false);
      }

      this.xhr.setTimeout(60000);
      this.xhr.send();
    } catch(err) {
      Titanium.UI.createAlertDialog({
        title: "Error",
        message: String(err),
        buttonNames: ['OK']
      }).show();
    }

  },

  get: function(params) {
    this.call('GET', params);
  },

  getResponseValues: function() {
    var result = this.response_values;
    this.response_values = null;
    return result;
  },

  getUrl: function(params) {
    var url = this.model.options.url;

    if (params) {
      if ((params.charAt(0) != '?')) {
        url += '?';
      }

      url += params;
    }

    return url;
  },

  setResponseValues: function(values) {
    this.response_values = values;
    this.xhrCallCompleted = true;
  }
};