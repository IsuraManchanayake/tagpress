$(document).ready(function() {
    $(".resizable").resizable();
});

function includeJS(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,
        error: function() {
            throw new Error("Could not load script " + script);
        }
    });
}

function extend(base, sub) {
    var origProto = sub.prototype;
    sub.prototype = Object.create(base.prototype);
    for (var key in origProto) {
        sub.prototype[key] = origProto[key];
    }
    Object.defineProperty(sub.prototype, 'constructor', {
        enumerable: false,
        value: sub
    });
}