
if (!String.prototype.format) {
    String.prototype.format = function () {
        var s = this;
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace ? s.replace(reg, arguments[i]) : s;
        }
        return s;
    }
};

if (!String.prototype.formatKey) {
    String.prototype.formatKey = function (refObject) {
        var s = this;
        refObject = refObject ? refObject : {}
        var match = s.match(/(?=\{)\{([a-zA-Z0-9?=.-]+)}|{([a-zA-Z0-9?=!.-]+)?([\w\s-'"().]+):([\w\s-'"().]+)}(?!\})/gm);

        match = match ? match : [];
        match.forEach(function (key, index) {
            var keys = undefined;
            var value = refObject;
            
            var sKey = key.slice(1, -1);

            function extract_condition(key,refValue) {
                if (key.split('?').length == 1) return false;
                //-------
                key = key.split('?');
                var statement = key[0];
                var result_true  = key[1].split(':')[0];
                var result_false = key[1].split(':')[1];
                //-------
                var compareEqual = statement.indexOf('=') > 0;
                var compareNot = statement.indexOf('!') > 0;

                var v = refValue;
                var k = statement;
                k = compareEqual ? statement.split('=')[0]:k;
                k = compareNot   ? statement.split('!')[0]:k;
                k = k.split('.');
                k.forEach(function (k, index) { v = v && v[k] ? v[k] : undefined; });

                if (!compareEqual && !compareNot) {
                    return v ? result_true : result_false;
                }
                if (compareEqual) {
                    var c = statement.split('=')[1];
                    return (v && v.toString()) == c.toString() ? result_true : result_false;
                }
                if (compareNot) {
                    var c = statement.split('!')[1];
                    return (v && v.toString()) != c.toString() ? result_true : result_false;
                }

            }
            function extract_value(key, refValue) {
                if (key.split('?').length > 1) return false;
                //------
                var v = refValue;
                var k = key.split('.');
                k.forEach(function (k, index) { v = v && v[k] ? v[k] : ''; });

                return v;
            }

            value = extract_condition(sKey, refObject);
            if (typeof(value) != 'boolean') { s = s.replace(key, value); }

            value = extract_value(sKey, refObject);
            if (typeof(value) != 'boolean') { s = s.replace(key, value); }

        });

        return s;
    }
}

if (!String.prototype.formatKeyStyle) {
    String.prototype.formatKeyStyle = function (refObject) {
        var s = this;
        refObject = refObject ? refObject : {}
        var match = s.match(/(?=\{)\{([a-zA-Z0-9ก-๙?., "#-]+)}(?!\})/gm);

        match = match ? match : [];
        match.forEach(function (key, index) {
            var value = refObject;
            //-----
            var keys = key.slice(1, -1).split(',');
            var comm = keys.length > 1 ? keys[1] : '';
            var args = keys.length > 2 ? keys.slice(2) : [];
            //-----
            keys = keys[0].split('.');
            //-----
            keys.forEach(function (k, index) { value = value[k] != undefined ? value[k] : "";});

            switch (comm) {
                case "PREFIXSTRING": { value = value.length ? args[0] + value : value; } break;
                case "PREFDATE": {
                    if (value) {
                        value = new Date(value);
                        value = value.toPreferenceDateString();
                    }
                } break;
                case "NUMBERFORMAT": { value = $.formatNumber(value, { format: args[0] }); } break;
            }

            s = s.replace(key, value);
        });

        return s;
    }
}

if (!String.prototype.toObject) {
    String.prototype.toObject = function (separator) {
        var array = this.split(separator);
        return JSON.parse("{\"" + array.join('": {\"') + "\": {" + array.map(function () { return '}' }).join('') + "}");
    }
};

if (!String.prototype.toByteFormat) {
    String.prototype.toByteFormat = function () {
        var size = parseFloat(this);

        if (size == undefined || /\D/.test(size)) return 'N/A';

        function round(num, precision) { return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision) }

        var boundary = Math.pow(1024, 4);

        if (size > boundary) { return "{0} Tb".format(round(size / boundary, 1)); } // TB
        if (size > (boundary /= 1024)) { return "{0} Gb".format(round(size / boundary, 1)); } // GB
        if (size > (boundary /= 1024)) { return "{0} Mb".format(round(size / boundary, 1)); } // MB
        if (size > 1024) { return "{0} Kb".format(Math.round(size / 1024)); } // KB

        return "{0} byte".format(size);
    }

};

if (!String.prototype.toByteString) {
    String.prototype.toByteString = function () {
        return this.toByteFormat();
    }

};

if (!String.prototype.is) {
    String.prototype.is = function (value) {
        return this.isValue(value, true, false);
    }
}

if (!String.prototype.isDateTime) {
    String.prototype.isDateTime = function () { var d = new Date(this); return !isNaN(d.valueOf()); }
}

if (!String.prototype.toFloat) {
    String.prototype.toFloat = function () { return this.isEmpty() || isNaN(this) ? 0 : parseFloat(this); }
}

if (!String.prototype.toInt) {
    String.prototype.toInt = function () { return this.isEmpty() || isNaN(this) ? 0 : parseInt(this); }
}

if (!String.prototype.padLeft) {
    String.prototype.padLeft = function (value) { var pad = this.valueOf(); value = value.toString(); return pad.substring(0, pad.length - value.length) + value; }
}

if (!String.prototype.firstUpperCase) {
    String.prototype.firstUpperCase = function () { return this.charAt(0).toUpperCase() + this.slice(1);}
}


/* CHANGE-LOG
 * 
 * 2017-06-09:1.0.3
 * String.prototype.firstUpperCase
 * - Added : เพิ่ม fn สำหรับแก้ไขขนาดอักษรตัวแรกให้เป็นตัวใหญ่
 * 
 * 2017-05-05:1.0.2
 * String.prototype.formatKeyStyle
 * - Added : เพิ่มการทำงานรองรับตัวเลือก PREFIXSTRING (เติมข้อความข้างหน้าถ้ามีข้อมูล )
 * 
 * 2017-03-26:1.0.1
 * String.prototype.formatKey
 * - Added : เพิ่มคุณสมบัติรองรับ key ที่มีรูปแบบเงื่อนไขได้ {key[=|!value]?[result-true]:[result-false]}
 * 
 */