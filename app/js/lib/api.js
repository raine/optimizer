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

// $(function() {
//   $('#droparea').on('drop', function(ev) {
//     ev.stopPropagation();
//     ev.preventDefault();
//
//     var files = ev.originalEvent.dataTransfer.files
//     if (files.length > 0) {
//       if (window.FormData === undefined) {
//         return console.error('FormData not available');
//       }
//
//       var fd_files = _.map(files, file2fd);
//       _.forEach(fd_files, upload)
//       return;
//
//       upload(data).then(function() {
//         console.log('done');
//       }).catch(function(e) {
//         console.log('error');
//       }).progress(function(ev) {
//         var done  = ev.position || ev.loaded
//           , total = ev.totalSize || ev.total;
//
//         console.log(done / total);
//         // var prcnt = Math.floor(done/total*1000)/10;
//         // console.log('progress', ev);
//       });
//     }
//   });
//
//   $('#droparea').on('dragover', function(ev) {
//     ev.preventDefault();
//   });
// });
