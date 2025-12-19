
if (!Object.prototype.assigns) {
    Object.defineProperty(Object.prototype, 'assigns',
       {
           enumerable: false,
           value: function (target, varArgs) {
               'use strict';
               if (target == null) { // TypeError if undefined or null
                   throw new TypeError('Cannot convert undefined or null to object');
               }

               var to = Object.create(target);

               for (var index = 1; index < arguments.length; index++) {
                   var nextSource = arguments[index];

                   if (nextSource != null) { // Skip over if undefined or null

                       for (var nextKey in nextSource) {
                           // Avoid bugs when hasOwnProperty is shadowed
                           if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                               if (typeof to[nextKey] === 'object'
                                   && to[nextKey]
                                   && typeof nextSource[nextKey] === 'object'
                                   && nextSource[nextKey]) {
                                   //แก้ไขการเขียนค่ากลับไปยัง parent object โดยการให้เขียนค่าลง {} แล้วเก็บค่าที่ส่งกลับมาแทน
                                   to[nextKey] = Object.assigns({}, to[nextKey], nextSource[nextKey]);

                               } else {
                                   to[nextKey] = nextSource[nextKey];
                               }
                           }
                       }
                   }
               }
               return to;
           }
        }
    );
}

if (!Object.prototype.length) {
    Object.defineProperty(Object.prototype, 'length',
       {
            enumerable: false,
            value: function (fn, scope) {
                return Object.keys(this).length;
            }
       }
   );
}

if (!Object.prototype.forEach) {
    Object.defineProperty(Object.prototype, 'forEach',
        {
            enumerable: false,
            configurable: true,
            value: function (fn, scope) {
                for (prop in this) { fn.call(scope, this[prop], prop, this); }
            }
        }
   );
}

if (!Object.prototype.sortKey) {
    Object.defineProperty(Object.prototype, 'sortKey',
       {
            enumerable: false,
            value: function (by, type) {
               return Object.keys(this).sort(function (a, b) { return this[a] - this[b] })
            }
       }
   );
}

if (!Object.prototype.is) {
    Object.defineProperty(Object.prototype, 'is',
        {
            enumerable   : false,
            configurable : true,
            value: function (compare, tValue, fValue) {
                compare = compare.isFunction() ? compare.call(this) : compare;
                tValue = tValue != undefined ? tValue : true;
                fValue = fValue != undefined ? fValue : false;

                switch (this.getType()) {
                    case "object": {
                        for (var prop in this) { if (this.hasOwnProperty(prop)) return fValue; }
                        return tValue;
                    } break;
                    default: { return this == compare ? tValue : fValue; }
                }
            }
        }
    );
};

if (!Object.prototype.isEmpty) {
    Object.defineProperty(Object.prototype, 'isEmpty',
        {
            enumerable: false,
            value: function () {
                return this.is.call(this,function () {
                    switch (this.getType()) {
                        case "object":  return this;    break;
                        case 'number':  return 0;       break;
                        case 'string':  return '';      break;
                        case 'function': return this(); break;
                        case 'array': return this.length; break;
                        default: { return undefined;}
                    }
                }, true, false);
            }
        }
    );
};

if (!Object.prototype.isEmptyToDefault) {
    Object.defineProperty(Object.prototype, 'isEmptyToDefault',
        {
            enumerable: false,
            value: function (value, key) {
                switch (this.getType()) {
                    case "object": {
                        if (this.isEmpty()) return value;
                        if (this.hasOwnProperty(key)) return this[key];
                    } break;
                    default: {
                        if (this.isEmpty()) return value;
                        //-----
                        return this.valueOf();
                    } break;
                }

                

            }
        }
    );
};

if (!Number.prototype.isNull) {
    Number.prototype.isNull = function (value) {
        return this.is(null, true, false);
    }
}




if (!Object.prototype.getType) {
    Object.defineProperty(Object.prototype, 'getType',
        {
            enumerable: false,
            value: function () {
                return this.constructor.name.toLowerCase();
            }
        }
    );
};

if (!Object.prototype.isType) {
    Object.defineProperty(Object.prototype, 'isType',
        {
            enumerable: false,
            value: function (name) {
                return this.getType() == name;
            }
        }
    );
};

if (!Object.prototype.isArray) {
    Object.defineProperty(Object.prototype, 'isArray',
        {
            enumerable: false,
            value: function () {
                return Array.isArray(this);
            }
        }
    );
};

if (!Object.prototype.isBoolean) {
    Object.defineProperty(Object.prototype, 'isBoolean',
        {
            enumerable: false,
            value: function () {
                return this.getType() == 'boolean';
            }
        }
    );
};

if (!Object.prototype.isFile) {
    Object.defineProperty(Object.prototype, 'isFile',
        {
            enumerable: false,
            value: function () {
                return this.getType() == 'file';
            }
        }
    );
};

if (!Object.prototype.isString) {
    Object.defineProperty(Object.prototype, 'isString',
        {
            enumerable: false,
            value: function () {
                return this.getType() == 'string';
            }
        }
    );
};

if (!Object.prototype.isNumber) {
    Object.defineProperty(Object.prototype, 'isNumber',
        {
            enumerable: false,
            value: function () {
                return this.getType() == 'number';
            }
        }
    );
};

if (!Object.prototype.isObject) {
    Object.defineProperty(Object.prototype, 'isObject',
        {
            enumerable: false,
            value: function () {
                return this.getType() == 'object';
            }
        }
    );
};

if (!Object.prototype.isFunction) {
    Object.defineProperty(Object.prototype, 'isFunction',
        {
            enumerable: false,
            value: function () {
                return this.getType() == 'function';
            }
        }
    );
};

//------

if (!Object.prototype.defineProperties) {
    Object.defineProperty(Object.prototype, "defineProperties", {
        enumerable: false,
        value: function () {
            var me = this;
            var args = Array.prototype.slice.call(arguments);
            args.forEach(function (field) {
                var value;
                Object.defineProperty(me, field, {
                    enumerable: false,
                    get: function () { return value; },
                    set: function (new_value) { value = new_value; }
                });
            });
        }
    });
}

if (!Object.prototype.defineMethods) {
    Object.defineProperty(Object.prototype, "defineMethods", {
        enumerable: false,
        value: function (methods, isEnumerable, scope, checkExist) {
            checkExist = checkExist == undefined ? true : checkExist;
            scope = scope ? scope : this;
            for (method in methods) {
                if (checkExist && scope[method] != undefined) continue;
                Object.defineProperty(scope, method, {
                    enumerable: isEnumerable ? true : false,
                    value: methods[method]
                });
            }
        }
    });
}

if (!Object.prototype.defineData) {
    Object.defineProperty(Object.prototype, "defineData", {
        enumerable: false,
        value: function (data, isEnumerable, scope, isWriteable) {
            for (key in data) {
                Object.defineProperty(scope ? scope : this, key, {
                    enumerable: isEnumerable ? true : false,
                    writable: isWriteable ? true : false,
                    value: data[key]
                });
            }
        }
    });
}

//------

if (!Object.prototype.extend) {
    Object.defineProperty(Object.prototype, 'extend',
        {
            enumerable: false,
            value: function (child, parent) {

                (function(){
                    if (child.prototype && child.prototype.isEmpty()) {

                        child.prototype = parent ? Object.create(parent.prototype) : Object.create(null);

                    } else {
                        
                        /*
                         * เนื่องจาก child-class มี method/property ใน prototype อยู่แล้ว
                         * จึงต้องใช้วิธีสร้างประกาศ prototype ใหม่จาก Object.create(parent.prototype)
                         * จากนั้นจึงทำการสร้าง property ใหม่จากคลาสเดิม
                         * 
                         * ในกรณีที่มีข้อมูล object ที่ซ้ำกัน จะนำข้อมูลมารวมกัน แล้วกำหนดให้ child class
                         */
                        var __ = function() { };
                        __.prototype = child.prototype;
                        child.prototype = Object.create(parent.prototype);
                        child.prototype.constructor = child;

                        for (var prop in __.prototype) {
                            if (!child.prototype.hasOwnProperty(prop)) {

                                var _prototypeData = undefined;

                                //if (prop == 'element') { console.log(prop); }

                                if (child.prototype[prop] && typeof (child.prototype[prop]) == 'object') {
                                    _prototypeData = Object.assigns({},child.prototype[prop], __.prototype[prop]);
                                }

                                Object.defineProperty(child.prototype, prop, {
                                    enumerable: true,
                                    writable: true,
                                    value: _prototypeData ? _prototypeData : __.prototype[prop]
                                });
                            }

                        }
                    }
                })(); //ทำการส่งต่อข้อมูล prototype จาก parent ไปยัง child

                /* NOTE
                 * กำหนดให้ทำการระบุ parent-class ในชื่อ super
                 * ให้ทำการกำหนดจาก defineProperty เนื่องจากมีการกำหนดใน parent-class มาก่อน 
                 * ตัวโครงสร้างภาษาจะไปดึงของที่ได้มาจาก parent-class ทันที และไม่สามารถ assign ค่าได้อีกด้วย
                 */
                Object.defineProperty(child.prototype, 'super', {
                    enumerable  : true,
                    value       : parent.prototype
                });

                child.prototype.constructor = child;
            }
        }
    );
};

if (!Object.prototype.extendMany) {
    Object.defineProperty(Object.prototype, 'extendMany',
        {
            enumerable: false,
            value: function () {
                var args = Array.prototype.slice.call(arguments);
                var parent = undefined;
                args.reverse().forEach(function (arg) {
                    if (!parent) parent = arg;
                    else { arg.extendFrom(parent); parent = arg; }
                });
            }
        }
    );
};

if (!Object.prototype.extendFrom) {
    Object.defineProperty(Object.prototype, 'extendFrom',
        {
            enumerable: false,
            value: function (parent) { this.extend(this,parent); }
        }
    );
};

if (!Object.prototype.extendFroms) {
    Object.defineProperty(Object.prototype, 'extendFroms',
        {
            enumerable: false,
            value: function () {
                var args = Array.prototype.slice.call(arguments);
                var parent = undefined;
                args.reverse().forEach(function (arg) {
                    if (arg) {
                        if (!parent) { parent = arg.clone(); }
                        else {
                            var tmpl = arg.clone();
                            tmpl.extendFrom(parent);
                            parent = tmpl;
                        }
                    }
                });

                if (parent) this.extend(this,parent);
                
            }
        }
    );
};

if (!Function.prototype.clone) {
    Object.defineProperty(Function.prototype, "clone", {
        enumerable: false,
        value: function () {
            var source = this;

            if (this._isClone) { var master = this.master; }
            function __() { return source.apply(this, arguments); };
            __.prototype = this.prototype;
            __._isClone = true;
            __._master = source;

            return __;
        }
    });
}

//-------

if (!Object.prototype.generatePreference) {
    Object.defineProperty(Object.prototype, 'generatePreference',
       {
           enumerable: false,
           value: function () {

               var el = document.getElementsByTagName('body');
               var at = el[0] && el[0].getAttribute('preference')? el[0].getAttribute('preference'): false;

               if (!at) return 0;

               var pref = "-{0}".format(at);
               this.forEach(function (value, key, obj) {
                   if (key.search(pref) > 0) {
                       obj[key.replace(pref, '')] = value;
                   }
               });

               return this;

           }
       }
   );
}

if (!Object.prototype.toFormData) {
    Object.defineProperty(Object.prototype, 'toFormData',
        {
            enumerable: false,
            value: function () {
                var fd = new FormData();
                this.forEach(function (value, key) {
                    if (typeof (value) == 'object') {
                        fd.append(key, JSON.stringify(value));
                    } else {
                        fd.append(key, value);
                    }
                });

                return fd;

            }
        }
    );
}


function NS(ns, name, fn) {
    ns = ns.split('.');
    if (ns.isArray() && !ns.length) return 0;

    var el = this;
    ns.forEach(function (v, index) {
        el[v] = el[v] || {};
        el = el[v];
    });

    if (fn) el[name] = fn;

    return el[name];
}


/* CHANGE LOGS
 * 2017-06-12:1.0.4
 * - Added : เพิ่ม fn เกี่ยวกับการตรวจสอบประเภทตัวแปร เพื่อไม่ต้องใช้คำสัง typeof() อีก
 * - Fixed : แก้ไข fn:isEmptyToDefault ให้ลองรับตัวแปรหลายประเภท
 * 
 * ----------------
 * 2017-05-24:1.0.3
 * - Fixed : แก้ไข fn:extend เพื่อให้ทำการรวม ส่วนของ object:data ของ parent รวมกับ child ในกรณีที่มีชื่อเดียวกัน
 * - Fixed : แก้ไข ที่มาของ property:super ให้อ้างอิงไปที่ parent.prototype
 * - Added : เพิ่ม fn:isEmptyToDefault()
 * ----------------
 * 2017-05-22:1.0.2
 * - Added : เพิ่ม fn:generatePreference() สำหรับแสดงข้อมูลตาม preference ของ body (ย้ายมาจาก module.js เพื่อให้ง่ายต่อการใข้งาน)
 * 
 * ----------------
 * 2017-05-20:1.0.1
 * - Added : เพิ่ม fn:isArray() เพื่อตรวจสอบประเภทข้อมูลของ object ว่าเป็น array หรือไม่ (เป็น fn เดียวกันกับ object:array จะได้ง่ายในการใช้คำสั่ง)
 * 
 * ----------------
 * 2016-03-04:1.0.0
 * - Moded : เปลี่ยนการกำหนดค่า prototype ใหม่ผ่านคำสั่ง defineProperty() เนื่องจากการใช้คำสั่งเก่า มีผลกระทบกับ jquery 2.0
 * 
 */
