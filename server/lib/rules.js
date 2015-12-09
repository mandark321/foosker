if (Meteor.isServer) {

  rules = [];

  defaultRule = {
    name: "default",
    method: function(url) {
      var page = HTTP.get(url).content;

      var cheerio = Meteor.npmRequire('cheerio'),
        $ = cheerio.load(page);

      var images = [];

      $("img").each(function(i, img) {
        images.push($(img).attr("src"));
      });

      return images;
    }
  }

  rules.push({
    name: "4chan",
    method: function(url) {
      var page = HTTP.get(url).content;
      var cheerio = Meteor.npmRequire('cheerio');
      var $ = cheerio.load(page);
      var images = [];

      $("img").each(function(i, img) {
        images.push($(img).attr("src"));
      });

      //thumbnails end up with ...s.jpg, let's remove that "s"
      var filtered = [];
      _.each(images, function(img) {
        if (img.toLowerCase().contains("s.")) {
          var withoutS = img.replace("s.", ".");
          filtered.push(withoutS);
        } else {
          //don't include any small images that can be found above/bellow the thread
        }
      });

      return filtered;
    },
    hosts: ["4chan.org", "www.4chan.org", "boards.4chan.org"]
  });

  //add more rules.push
}
