import $ from 'jquery';

$(document).ready(() => {
  $('#database').popover({
    content: 'Database names cannot be empty, must have fewer than 64 characters and must not contain /. "$*<>:|?',
  });

  const $deleteButton = $('.deleteButton');

  $deleteButton.tooltip({
    title: 'Warning! Are you sure you want to delete this database? All collenctions and documents will be deleted.',
  });

  $deleteButton.on('click', (event) => {

    $deleteButton.tooltip('hide');

    event.preventDefault();

    const $target = $(this);
    const parentForm = $('#' + $target.attr('childof'));

    const dbName = $target.attr('database-name');

    $('#confirmation-input').attr('shouldbe', dbName);
    $('#modal-database-name').text(dbName);
    $('#confirm-deletion').modal({ backdrop: 'static', keyboard: false })
      .one('shown.bs.modal', () => {
        $('#confirmation-input').focus();
      })
      .one('click', '#delete', () => {
        const input = $('#confirmation-input');
        if (input.val().toLowerCase() === input.attr('shouldbe').toLowerCase()) {
          parentForm.trigger('submit');
        }
      });
  });
});
