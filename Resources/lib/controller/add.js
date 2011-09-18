var controller = (function() {
  var api = {};

  api.extractValues = function(container) {
    var result = [];

    joli.each(container, function(field, key) {
      result[key] = field.value;
    });

    return result;
  };

  api.save = function(values) {
    joli.models.get('people')
      .newRecord(values, true)
      .save();
  };

  return api;
})();