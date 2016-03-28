SearchSource.defineSource('tags', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};
  if(searchText) {
    var regExp = buildRegExp(searchText);
    
    var selector = {$and: [{tags: {$in: [regExp]}}, {canView: {$in: [ Meteor.userId() ]}}]};
    return Resources.find(selector, options).fetch();
  } else {
    return Resources.find({canView: {$in: [ Meteor.userId() ]}}, options).fetch();
  }
});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[\,\-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}
