import $ from 'jquery';
import renderjson from 'renderjson';
import CodeMirror from './codeMirrorLoader';

const $document = $(document);

function getParameterByName(name) {
  name = name.replace(/\[/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

$document.ready(function () {
  $('#tabs').tab();
  if (document.location.href.indexOf('query=') >= 0 && getParameterByName('query') !== '') {
    $('#tabs a[href="#advanced"]').tab('show');
  }
});

const addDoc = CodeMirror.fromTextArea(document.getElementById('document'), {
  mode: { name: 'javascript', json: true },
  indentUnit: 4,
  electricChars: true,
  matchBrackets: true,
  lineNumbers: true,
  theme: ME_SETTINGS.codeMirrorEditorTheme,
});

const addIndexDoc = CodeMirror.fromTextArea(document.getElementById('index'), {
  mode: { name: 'javascript', json: true },
  indentUnit: 4,
  electricChars: true,
  matchBrackets: true,
  lineNumbers: true,
  theme: ME_SETTINGS.codeMirrorEditorTheme,
});


window.checkValidJSON = function () {
  $.ajax({
    type: 'POST',
    url: `${ME_SETTINGS.baseHref}checkValid`,
    data: {
      document: addDoc.getValue(),
    },
  }).done((data) => {
    if (data === 'Valid') {
      $('#documentInvalidJSON').remove();
      $('#addDocumentForm').submit();
    } else if ($('#documentInvalidJSON').length === 0) {
      $('#document-modal-body').parent().append('<div id="documentInvalidJSON" class="alert alert-danger"><strong>Invalid JSON</strong></div>');
    }
  });
  return false;
};

window.checkValidIndexJSON = function () {
  $.ajax({
    type: 'POST',
    url: `${ME_SETTINGS.baseHref}checkValid`,
    data: {
      document: addIndexDoc.getValue(),
    },
  }).done((data) => {
    if (data === 'Valid') {
      $('#indexInvalidJSON').remove();
      $('#addIndexForm').submit();
    } else if ($('#indexInvalidJSON').length === 0) {
      $('#index-modal-body').parent().append('<div id="indexInvalidJSON" class="alert alert-danger"><strong>Invalid JSON</strong></div>');
    }
  });
  return false;
};

$('#addDocument').on('shown.bs.modal', function () {
  addDoc.refresh();
  addDoc.focus();
});

$('#addIndex').on('shown.bs.modal', function () {
  addIndexDoc.refresh();
  addIndexDoc.focus();
});

if (ME_SETTINGS.collapsibleJSON) {
  $(function () {
    // convert all objects to renderjson elements
    $('div.tableContent pre').each(function () {
      const $this = $(this);
      const text = $.trim($this.text());
      if (text) {
        $this.html(renderjson(JSON.parse(text)));
      }
    });
  });
  renderjson.set_show_to_level(ME_SETTINGS.collapsibleJSONDefaultUnfold);
}

function makeCollectionUrl() {
  const st = ME_SETTINGS;
  return `${st.baseHref}db/${st.dbName}/${st.collectionName}/`;
}

window.loadDocument = function (id) {
  location.href = `${makeCollectionUrl()}${encodeURIComponent(id)}`;
};

$document.ready(function () {
  const $tableWrapper = $('.tableWrapper');
  if ($('.tableHeaderFooterBars').width() === $tableWrapper.width()) {
    // table wrapper is the same width as the table itself, so not overflowing, so remove the white gradient
    $('.fadeToWhite').remove();
  } else {
    $('.fadeToWhite').height($('.tableWrapper').height()); // limit the height only to the table div
  }

  $('.deleteButtonCollection').tooltip({
    title: 'Are you sure you want to delete this collection? All documents will be deleted.',
  });

  $tableWrapper.scroll(function () {
    const proximityToRightOfTable = $('.tableWrapper table').width() - $tableWrapper.scrollLeft() - $tableWrapper.width();
    document.getElementById('fadeToWhiteID').style.opacity = Math.min(Math.max(proximityToRightOfTable - 50, 50) - 50, 100) / 100;
  });

  $('.tooDamnBig').bind('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const target = $(this);
    const _id = target.attr('doc_id');
    const prop = target.attr('doc_prop');
    const spinner = `<img src="${ME_SETTINGS.baseHref}public/img/gears.gif" />`;
    const leftScroll = $tableWrapper.scrollLeft();

    // Set the element with spinner for now
    target.html(spinner);

    $.get(`${makeCollectionUrl()}${encodeURIComponent(_id)}/${prop}`, function (input) {

      // Images inline
      if (
        typeof input === 'string' &&
        (
          input.substr(0, 22) === 'data:image/png;base64,' ||
          input.substr(0, 22) === 'data:image/gif;base64,' ||
          input.substr(0, 22) === 'data:image/jpg;base64,' ||
          input.substr(0, 23) === 'data:image/jpeg;base64,'
        )
      )  {
        input = '<img src="' + input + '" style="max-height:100%; max-width:100%; "/>';
      }

      // Audio inline
      if (
        typeof input === 'string' &&
        (
          input.substr(0, 22) === 'data:audio/ogg;base64,' ||
          input.substr(0, 22) === 'data:audio/mp3;base64,'
        )
      )  {
        input = '<audio controls style="width:45px;" src="' + input + '">Your browser does not support the audio element.</audio>';
      }

      // Video inline
      if (
        typeof input === 'string' &&
        (
          input.substr(0, 23) === 'data:video/webm;base64,' ||
          input.substr(0, 22) === 'data:video/mp4;base64,'  ||
          input.substr(0, 22) === 'data:video/ogv;base64,'
        )
      )  {
        input = '<video controls><source type="' + input.substring(input.indexOf(':') + 1, input.indexOf(';')) + '" src="' + input + '"/>' +
          'Your browser does not support the video element.</video>';
      }

      if (typeof input === 'object' && (input.toString() === '[object Object]' || input.toString().substr(0, 7) === '[object')) {
        input = renderjson(input);
      }

      // Set the element with gotten datas
      target.parent().html(input);

      // Set original scroll position
      $('.tableWrapper').scrollLeft(leftScroll);
    });
  });

  $('.deleteButtonDocument').on('click', function (e) {
    const $form = $(this).closest('form');
    e.stopPropagation();
    e.preventDefault();

    $('#confirm-deletion-document').modal({ backdrop: 'static', keyboard: false }).one('click', '#delete', function () {
      $form.trigger('submit'); // submit the form
    });
  });

  $('#deleteListConfirmButton').on('click', function () {
    // we just need to POST the form, as all the query parameters are already embedded in the form action
    $('#deleteListForm').trigger('submit');
  });

  $('.deleteButtonCollection').on('click', function (event) {

    $('.deleteButtonCollection').tooltip('hide');

    event.preventDefault();

    const $target = $(this);
    const $parentForm = $('#' + $target.attr('childof'));

    $('#confirmation-input').attr('shouldbe', $target.attr('collection-name'));
    $('#modal-collection-name').text($target.attr('collection-name'));
    $('#confirm-deletion-collection').modal({ backdrop: 'static', keyboard: false })
      .one('shown.bs.modal', function () {
        $('#confirmation-input').focus();
      })
      .one('click', '#delete', function () {
        const $input = $('#confirmation-input');
        if ($input.val().toLowerCase() === $input.attr('shouldbe').toLowerCase()) {
          $parentForm.trigger('submit');
        }
      });
  });

  const nextSort = {
    1: -1,
    '-1': 0,
    0: 1,
    undefined: 1,
  };
  $('.sorting-button').on('click', function () {
    const $this = $(this);
    const column = $this.data('column');
    const direction = nextSort[$this.data('direction')];

    $('input.sort-' + column).val(direction).prop('checked', direction !== 0);

    const $form = $($('#tabs li.active a').attr('href') + ' form');
    $form.find('button[type="submit"]').click();
  });
});
