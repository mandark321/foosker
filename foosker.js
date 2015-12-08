if (Meteor.isClient) {
  angular.module("foosker", ["angular-meteor"]);

  angular.module("foosker").controller("HomeCtrl", ["$scope", "$log", "$meteor", function($scope, $log, $meteor) {
    $scope.url = "";
    $scope.homeThumbnails = [];
    $scope.urlThumbnails = [];

    $scope.url = "http://boards.4chan.org/wg/thread/6396109/alphabet-game";

    $scope.go = function() {
      $scope.urlThumbnails.length = 0;

      var data = {
        host: getLocation($scope.url).host,
        url: $scope.url
      };

      $meteor.call("getImages", data).then(function(images) {
          $log.debug("Total images loaded:", images.length);

          _.each(images, function(img) {
            $scope.urlThumbnails.push(img);
          })
        },
        function(err) {
          $log.error("Error loading page.");
        });
    }


    function getLocation(href) {
      var location = document.createElement("a");
      location.href = href;
      // IE doesn't populate all link properties when setting .href with a relative URL,
      // however .href will return an absolute URL which then can be used on itself
      // to populate these additional fields.
      if (location.host == "") {
        location.href = location.href;
      }
      return location;
    };

    $(".tnails").on("error", "img", function() {
      $log.debug("ERROR on img");
      $(this).hide();
    });

    $scope.go();

  }]);

  angular.module("foosker").directive('thumbnail', function() {
    function link(scope, iElement, attr) {
      iElement.find("img").bind('error', function() {
        $(this).closest("thumbnail").remove();
        console.debug("Removed due to dead link!");
      });
    }

    return {
      link: link,
      template: function(elem, attr) {
        return '<a href="' + attr.url + '"><img src="' + attr.url + '"/></a>'
      },
      transclude: true
    };
  });

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
    Meteor.methods({
      'getImages': function(data) {
        var images = handleGetImages(data);

        console.log("Total found images:", images.length);

        return images;
      }
    });

    function handleGetImages(urlObj) {
      var rule;
      _.each(rules, function(r) {
        if (_.contains(r.hosts, urlObj.host)) {
          rule = r;
          return false;
        }
      });

      if (!rule) {
        rule = defaultRule;
      }

      console.log("Using rule:", rule.name);

      return (rule.method(urlObj.url));
    }

  });
}
