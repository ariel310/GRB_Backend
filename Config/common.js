exports.validateError = function(err, res, tipo, mensaje) {

    if (err) {
        return res.status(tipo).json({
            ok: false,
            mensaje: mensaje,
            error: err
        });
    }

    return true;
}

exports.responseOK = function(objeto, tipoObjeto, res, tipo, mensaje) {

    return res.status(tipo).json({
        ok: false,
        mensaje: mensaje,
        [tipoObjeto]: objeto
    });

}

exports.capitalize = function(word) {
    let upper = word.trim();
    upper = upper.toLowerCase();

    var splitStr = upper.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');

}