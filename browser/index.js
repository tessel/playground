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
  var ambient = new Ambient();
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
      this.contentWindow.postMessage(JSON.stringify($('#range').val()), '*')
    })
  })

  window.addEventListener('message', function (e) {
    console.log(e);
    var data = JSON.parse(e.data);
    $('#output').append(data.join(' ') + '\n');
    $('#output')[0].scrollTop = 1e6;
  }, false)

  $('#run').on('click', function () {
    $('iframe').remove();
    $('#output').html('');

    var sandbox = new Sandbox;
    sandbox.bundle(prefix.replace('temp = 0', 'temp = ' + $('#range').val()) + '\n' + myCodeMirror.getValue());
  })
})
