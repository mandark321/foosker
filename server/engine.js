Meteor.methods({
  'getImages': function(url) {
    console.log("Called getImages on server with Url:", url);

    var images = handleGetImages(url);

    console.log("Total found images:", images.length);

    return images;
  }
});

function handleGetImages(url) {
  var rule;
  _.each(rules, function(r) {
    if (_.contains(r.hosts, url.hostname)) {
      rule = r;
      return false;
    }
  });

  if (!rule) {
    rule = defaultRule;
  }

  console.log("Using rule:", rule.name);

  var images = rule.method(url.href);

  return withAbsolutePaths(url, images);
}

function getAbsolutePath(url, img, regex) {
  if (regex.test(img)) return img;

  return url.protocol + "//" + url.hostname + img;
}

function withAbsolutePaths(url, images) {
  var regex = new RegExp('^(?:[a-z]+:)?//', 'i');
  return _.map(images, function(img) {
    return getAbsolutePath(url, img, regex);
  });
}
