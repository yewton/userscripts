// ==UserScript==
// @name        Component-labels for JIRA Scrum
// @namespace   https://github.com/yewton
// @description Show components as labels in JIRA Scrum
// @include     https://www.example.org/secure/RapidBoard.jspa*
// @version     0.0.1
// @grant       GM_xmlhttpRequest
// @require     https://code.jquery.com/jquery-1.12.0.min.js
// ==/UserScript==

// cf. http://slides.com/kbigwheel/how-to-greasemonkey-in-ajax#/5
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
  $('.js-issue').filter(function () {
    return !!!$(this).data('cl-added');
  }).each(function () {
    var $issue = $(this);
    $issue.data('cl-added', true);

    var key = $issue.data('issue-key');

    if (!!!key) return;

    var id = $issue.data('issue-id');
    var $end = $issue.find('.ghx-end');

    $.get('/rest/api/2/issue/' + key + '?fields=components', function (data) {
      data.fields.components.forEach(function (component) {
        var marker = 'cl-label-' + component.id;
        if (0 < $end.find('.' + marker).length) return;
        var seed = component.id + component.name.charCodeAt(0);
        var label = (seed % 9) + 1;
        var $c = $('<span class="aui-label ghx-label-' + label + ' ' + marker + '">' + component.name + '</span>');
        $end.prepend($c);
      });
    });
  });
});

observer.observe(document, {
  subtree: true,
  attributes: true
});
