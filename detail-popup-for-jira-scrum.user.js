// ==UserScript==
// @name        Detail Pop-up for JIRA Scrum
// @namespace   https://github.com/yewton
// @description Add buttons to pop-up the detail view
// @include     https://www.example.org/secure/RapidBoard.jspa*
// @version     0.0.1
// @grant       GM_xmlhttpRequest
// @require     https://code.jquery.com/jquery-1.12.0.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/simplemodal/1.4.4/jquery.simplemodal.min.js
// ==/UserScript==

var $iframe = $('<iframe width="100%" height="100%" allowfullscreen></iframe>');

// cf. http://slides.com/kbigwheel/how-to-greasemonkey-in-ajax#/5
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
  $('.js-issue').filter(function () {
    return !!!$(this).data('dp-added');
  }).each(function () {
    var $issue = $(this);
    $issue.data('dp-added', true);

    var key = $issue.data('issue-key');

    if (!!!key) return;

    var $content = $issue.find('.ghx-issue-content');

    var viewDetailButtonClass = 'dp-view-detail-button';
    if (0 < $content.find('.' + viewDetailButtonClass).length) return;

    var $viewDetailButton = $('<button class="' + viewDetailButtonClass + '" data-issue-key="' + key + '"href="#"><span class="aui-icon aui-icon-small aui-iconfont-details">View</span></button>');
    $viewDetailButton.click(function (event) {
      event.preventDefault();
      $iframe.modal({
        closeHTML: '',
        containerCss:{
          backgroundColor: '#999',
          height: '90%',
          padding: 0,
          width: '90%'
        },
        opacity: 80,
        overlayCss: { backgroundColor: '#FFF' },
        overlayClose: true,
        onShow: function() {
          $iframe.attr('src', '/browse/' + key);
        }
      });
    });
    $content.prepend($viewDetailButton);
  });

});

observer.observe(document, {
  subtree: true,
  attributes: true
});
