var $ = require('jquery');
var CodeMirror = require('codemirror');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/mode/javascript/javascript');
var Sandbox = require('browser-module-sandbox')


function okay () {
  EOF
  function Ambient () {

  }
  var console = {
    log: function () {
      window.top.postMessage(JSON.stringify([].slice.apply(arguments)), '*');
    }
  };
  function __require (str) {
    if (str == 'tessel') {
      return { port: { 'A': {} } };
    }
    if (str == 'ambient-att84') {
      return { use: function () {
        return new Ambient();
      } };
    }
  }
  var temp = 0;
  window.addEventListener('message', function (e) {
    var data = JSON.parse(e.data);
    temp = data;
  }, false)
  Ambient.prototype.on = function (d, caller) {
    setInterval(function () {
      caller(temp);
    }, 300);
  }
  EOF
}

$(function () {
  var prefix = okay.toString().replace(/^[\s\S]*?EOF\s*/, '').replace(/\s*EOF[\s\S]*?$/, '');

  var body = $('textarea')[0];

  var myCodeMirror = CodeMirror.fromTextArea(body, {
    lineNumbers: true,
    mode:  "javascript",
    theme: 'monokai',
  });

  $('#range').on('mousemove change mousedown', function () {
    $('iframe').each(function () {
      var temp = $('#range').val();
      this.contentWindow.postMessage(JSON.stringify(temp), '*')
      $('#heat').toggle(temp == 100);
    })
  })

  window.addEventListener('message', function (e) {
    console.log(e);
    var data = JSON.parse(e.data);
    if (data && data.join) {
      $('#output').append(data.join(' ') + '\n');
      $('#output')[0].scrollTop = 1e6;
    }
  }, false)

  $('#run').on('click', function () {
    $('iframe').remove();
    $('#output').html('');

    var code = prefix.replace('temp = 0', 'temp = ' + $('#range').val()) + '\n' + myCodeMirror.getValue();
    code = code.replace(/\brequire\b/g, '__require');

    console.log(code);

    var sandbox = new Sandbox;
    sandbox.bundle(code);
  })
})
