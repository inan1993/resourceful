SearchSource.defineSource('tags', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};
  var user = Meteor.users.find({_id: Meteor.userId()})
  console.log(user.emails);
  if(searchText) {
    var regExp = buildRegExp(searchText);
    
    var selector = {$and: [{tags: {$in: [regExp]}}, {cannotView: {$in: [user.emails]}}]};
    return Resources.find(selector, options).fetch();
  } else {
    return Resources.find({cannotView: {$in: [user.emails]}}, options).fetch();
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
