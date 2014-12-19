$(function() {
  $('#init').on('submit', function() {
    $('#field').html('');
    var width = parseInt($('#width').val())
      , height = parseInt($('#height').val())
    ;

    var table = $('<table>', {'id': 'map'});
    for (var i=0; i<height; i++) {
      var tr = $('<tr>');
      for (var j=0; j<width; j++) {
        var td = $('<td>', {'class': 'ng'});
        tr.append(td);
      }
      table.append(tr);
    }
    $('#field').append(table);

    return false;
  }).trigger('submit');

  $('#field').on('click', 'td', function() {
    $(this).toggleClass('ng');
  });

  $('#csv').on('submit', function() {
    var result = '';
    $('#map').find('tr').each(function(y) {
      var line = [];
      $(this).find('td').each(function(x) {
        if ($(this).hasClass('ng')) {
          line.push(1);
        } else {
          line.push(0);
        }
      });
      result += line.join()+"\n";
    });
    $('#output').val(result);
    return false;
  });

  $('#render').on('submit', function() {
    var txt = $('#output').val();
    var lines = txt.split('\n');
    var table = $('<table>', {'id': 'map'});
    lines.forEach(function(line) {
      var tr = $('<tr>');
      var cells = line.split(',');
      cells.forEach(function(cell) {
        cell = parseInt(cell);
        var td = $('<td>');
        if (cell == 1) {
          td.addClass('ng');
          tr.append(td);
        } else if (cell == 0) {
          tr.append(td);
        }
      });
      table.append(tr);
    });
    $('#field').html(table);
    return false;
  });

});
