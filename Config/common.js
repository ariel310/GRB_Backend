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
    upper = upper.replace(/^\w/, c => c.toUpperCase());
    return upper
}