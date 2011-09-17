(function() {
  // empty table
  models.people.truncate();

  // load the people from the service
  models.people.forceReload();
})();