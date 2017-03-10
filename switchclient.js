/**
 * Created by dstewart on 3/10/2017.
 */
window.onload = function () {
    var url,
        i,
        jqxhr;

    for (i = 0; i < 2; i++) {
        url = document.URL + 'inputs/' + i;
        jqxhr = $.getJSON(url, function(data) {
            console.log('API response received');
            $('#input').append('<p>input gpio port ' + data['gpio'] + ' on pin ' +
                data['pin'] + ' has current value ' + data['value'] + '</p>');
        });
    }
};

setInterval( function () {
    for (i in ports) {
// call the API for each input port here
    }
}, 1000); // setInterval to 1 second