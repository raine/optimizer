var Promise = require('bluebird')
  , $ = require('jquery')
;

exports.uploadFile = function(path, formData) {
  var deferred = Promise.defer();
  var xhr = $.ajax({
    type: 'POST',
    url: path,
    contentType: false,
    processData: false,
    data: formData,
    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener('progress', function(ev) {
        deferred.progress(ev);
      }, false);
      return xhr;
    },
    success : deferred.resolve.bind(deferred),
    error   : deferred.reject.bind(deferred)
  });
  return deferred.promise;
};
