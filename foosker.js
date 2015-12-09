if (Meteor.isClient) {
  angular.module("foosker", ["angular-meteor"]);

  angular.module("foosker").controller("HomeCtrl", ["$scope", "$log", "$meteor", function($scope, $log, $meteor) {
    $scope.applicationName = applicationName;
    $scope.url = "";
    $scope.homeThumbnails = [];
    $scope.urlThumbnails = [];

    $scope.url = "http://boards.4chan.org/wg/thread/6396109/alphabet-game";

    $scope.go = function() {
      $scope.urlThumbnails.length = 0;

      $meteor.call("getImages", getUrl($scope.url)).then(function(images) {
          $log.debug("Total images loaded:", images.length);
          angular.copy(images, $scope.urlThumbnails);
        },
        function(err) {
          $log.error("Error loading page.");
        });
    }

    $scope.download = function() {
      var images = $(".thumbnails img");

      _.each(images, function(a, index) {
        var $a = $(a);
        $(a)[0].click();
      })



      // var zip = new JSZip();
      // var images = $(".thumbnails img");
      //
      // _.each(images, function(img, index) {
      //   zip.file(index + ".jpg", getBase64Image(img.src), {
      //     base64: true
      //   });
      // })
      //
      // var content = zip.generate({
      //   type: "blob"
      // });
      // saveAs(content, "example.zip");
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

    function getBase64Image(url) {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;

      // Create an empty canvas element
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Copy the image contents to the canvas
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Get the data-URL formatted image
      // Firefox supports PNG and JPEG. You could check img.src to
      // guess the original format, but be aware the using "image/jpg"
      // will re-encode the image.
      var dataURL = canvas.toDataURL("image/png");

      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    // $('[data-toggle="tooltip"]').tooltip();

    // $scope.go();

  }]);

  angular.module("foosker").directive('thumbnail', function() {
    function link(scope, iElement, attr) {
      iElement.find("img").bind('error', function() {
        $(this).closest(".thumbnail-wrap").hide();
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

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
