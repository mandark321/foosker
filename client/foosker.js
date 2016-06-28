  angular.module("foosker", ["angular-meteor"]);

  angular.module("foosker").controller("HomeCtrl", ["$scope", "$log", "$meteor", function($scope, $log, $meteor) {
    $scope.applicationName = applicationName;
    $scope.url = "";
    $scope.homeThumbnails = [];
    $scope.links = [];

    $scope.url = "https://boards.4CHAN.org/wg/thread/6579146/wlsg-waterlandscape-general-1";

    $scope.go = function() {
      $scope.links.length = 0;

      $meteor.call("getImages", getUrl($scope.url)).then(function(images) {
          $log.debug("Total images loaded:", images.length);
          var images = _.map(images, function(img, index) {
            return {
              src: img,
              id: index
            };
          });
          angular.copy(images, $scope.links);
        },
        function(err) {
          $log.error("Error loading page.");
        });
    }

    $scope.download = function() {
      var images = $("#links a");

      _.each(images, function(a, index) {
        var $a = $(a);
        $(a)[0].click();
      });
    }

    $scope.deleteUrlThumbnail = function(id) {
      $scope.links = _.reject($scope.links, function(item) {
        return item.id == id;
      });
    }

    function getUrl(href) {
      var location = document.createElement("a");
      location.href = href;
      // IE doesn't populate all link properties when setting .href with a relative URL,
      // however .href will return an absolute URL which then can be used on itself
      // to populate these additional fields.
      if (location.host == "") {
        location.href = location.href;
      }
      var url = {
        href: href,
        hostname: location.host,
        protocol: location.protocol
      }
      return url;
    };

    // $('[data-toggle="tooltip"]').tooltip();

    // $scope.go();

  }]);

  angular.module("foosker").directive('thumbnail', function() {
    function link(scope, iElement, attr) {
      iElement.find("img").bind('error', function() {
        console.log("Removing one", attr.myId);
        scope.deleteUrlThumbnail(attr.myId);
        // $(this).closest(".thumbnail-wrap").hide();
      });
    }

    return {
      link: link,
      template: function(elem, attr) {
        return '<a href="' + attr.url + '" download><img src="' + attr.url + '"/></a>'
      },
      transclude: true
    };
  });

  $(document).ready(function() {
    $("#links").on("click", ".thumbnail-wrap", function(event) {
      if ($(event.target).is("a")) return;
      event = event || window.event;
      var target = $(this).find("a")[0],
        link = target.src ? target.parentNode : target,
        options = {
          index: link,
          event: event
        },
        links = $("#links a");
      blueimp.Gallery(links, options);
    })
  });
