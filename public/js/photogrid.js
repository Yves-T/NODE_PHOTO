$(function () {

  var grid;

  function initIsotope() {
    var grid = $('.galleryRow').imagesLoaded(function () {
      grid.isotope({
        itemSelector: '.item',
        percentPosition: true,
        // fitWidth: true,

        masonry: {
          columnWidth: '.grid-sizer',
          // use element for option
          gutterWidth: 2,
        }
      });
    });

    return grid;
  }

  $('.progress').hide();
  var btnElement = document.querySelector('#doUpload');
  setEnabledUploadBtn(true);
  var inputField = document.querySelector('.uploadPic');

  function setEnabledUploadBtn(enabled) {
    btnElement.disabled = enabled;
  }

  $(document).on('click', '#doUpload', function () {
    uploadNow();
  });

  inputField.onclick = function () {
    setEnabledUploadBtn(true);
    // set value to null otherwise onchange will not fire
    inputField.value = null;
  };

  var socket = io(host);

  socket.on('status', function (data) {
    showStatus(data.msg, data.delay);
  });

  socket.on('doUpdate', function () {
    renderList();
  });

  function renderList() {
    var list = document.querySelector('.galleryRow');
    list.innerHTML = '';
    var spacer = document.createElement('div');
    spacer.setAttribute('class', 'grid-sizer col-xs-12 col-sm-6 col-md-3 col-lg-3');

    ajax({
      url: host + '/getImages',
      success: function (data) {
        var imageList = JSON.parse(data.response);

        imageList.forEach(function (image) {
          var template = buildTemplate(image);
          var listElement = document.createElement('div');
          listElement.setAttribute('class', 'col-xs-12 col-sm-4 col-md-3 item');
          listElement.innerHTML = template;
          list.appendChild(listElement);
        });
        list.appendChild(spacer);
        handleIsotope(list);
      }
    });
  }

  function buildTemplate(image) {
    var template = '<div class="overlay">';
    template += '<div class="voteCtrl">';
    template += '<a href="#" data-photoid="' + image._id + '" class="voteUp">';
    template += '<div class="voteWrapper">';
    template += '<i class="fa fa-heart ico" aria-hidden="true"></i>';
    template += '<span class="text">' + image.votes + '</span>';
    template += '</div>';
    template += '</a>';
    template += '</div>';
    template += '</div>';
    template += '<a class="thumbnail">';
    template += '<div class="imageHolder">';
    template += '<img src="http://d180ozw9d89frg.cloudfront.net/' + image.filename + '" alt="">';
    template += '</div>';
    template += '</a>';
    template += '</li>';

    return template;
  }

  function handleIsotope(list) {
    if (grid) {
      // notify isotope about changed list and relayout
      grid.isotope('appended', list);
      grid.isotope('layout');
    } else {
      grid = initIsotope();
    }
  }

  document.addEventListener('click', function (event) {
    if ('fa fa-heart ico' == event.target.className) {
      var voteButton = event.target.parentNode;
      var h4Element = voteButton.lastChild;
      var photoId = event.target.parentNode.parentNode.dataset.photoid;
      var that = this;
      ajax({
        url: host + '/voteup/' + photoId,
        success: function (data) {
          var parseData = JSON.parse(data.response);
          h4Element.innerHTML = parseData.votes;
        }
      });
    }
  });

  function uploadNow() {
    var btnElement = document.querySelector('#doUpload');
    setEnabledUploadBtn(true);
    $('.progress').fadeIn(100);
    var uploadUrl = host + '/upload';
    var uploadFile = $('.uploadPic');
    if (uploadFile.val() !== '') {
      var form = new FormData();
      form.append('upload', uploadFile[0].files[0]);
      // perform the AJAX POST request and send the file
      ajax({
        method: 'post',
        url: uploadUrl,
        success: function () {
          $('.progress').fadeOut(200);
          uploadFile.val('');
          $('.galleryRow').isotope();
        },
        progress: function (event) {
          if (event.lengthComputable) {
            var percentage = Math.round((event.loaded * 100 / event.total));
            $('.progress-bar').css('width', (percentage + '%'));
          }
        },
        payload: form
      });
    }
  }

  renderList();
});
