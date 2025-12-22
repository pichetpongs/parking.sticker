

function NS(ns, name, fn, root = globalThis) {
    ns = ns.split('.').filter(Boolean);
    if (!ns.length) return null;

    var el = root;
    ns.forEach(function (v, index) {
        el[v] = el[v] || {};
        el = el[v];
    });

    if (fn) el[name] = fn;

    return el[name];
}

var App = App || {};                                                         
//-----
const NAMESPACE = 'App.Class.Module';
const NAMECLASS = 'Main';
//-----
const INSTANCE  = 'Viewer';

NS(NAMESPACE, NAMECLASS, (() => {

    const VERSION     = "2.0.5";
    const CODE_CLIENT = "nist2"; //กำหนดรหัสของ client 

    const API_ACTION = {
        "permit-regist" : "permit-regist",
        "permit-public" : "permit-public",
        "permit-private": "permit-private"
    }

    //URL สำหรับดึงข้อมูล
    const URL_API = "https://script.google.com/macros/s/AKfycbzAPAhWxwU26Gd92Mk8H1-I3br7pcU_PmpRRzyQXSyXR2SLo998xWp8yM8gr71VvQxb/exec?channel=web";

    //ตัวกำหนดให้ server อ่านค่าจาก json (0) หรือจากตารางข้อมูล (1)
    const OPT_DIRECT = 0;

    //require parameter ของค่า qr-code
    const URLPARAM_QR = "c";

    const STORE_PREFIX          = "app.parkqr:";
    const STORE_VALUE_PREF      = ".pref-lang";
    const STORE_VALUE_PASSKEY   = ".passkey"

    //จำนวนเวลาที่ทำให้ค่าของ localstorage ของ passkey ยังคงใช้งานอยู่ได้
    const STORE_TTL_PASSKEY = 4 * 60 * 60 * 1000;

    //ค่า timeout ของการ fetch ข้อมูล (ms)
    const TIMEOUT_FETCH = 12000;
    
    const FMT_DATELONG = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const FMT_DATESHORT = { year: 'numeric', month: 'short', day: 'numeric' };

    const I18N = {
        get_text: (code) => {

            let lang = I18N[I18N_CODE] || I18N['th-TH'];
            let keys = code.split('.');
            let res
            keys.forEach(function (n) {
                if (!lang[n]) {  return 0; }
                if (lang[n].isObject()) { lang = lang[n]; return 0;}
                //-----
                res = lang[n];
                
            });

            return res;
        },

        "en-EN": {
            "title": "ParkQR Viewer - NICE SUITES Sanambinnam Condominium",
            "version": `ParkQR Viewer (version ${VERSION})`,
            "header01": "Parking Permit Holder Information",
            "header02": "New registration",
            "header03": "Owner information",
            "header-vehicle01": "Vehicle #1",
            "header-vehicle02": "Vehicle #2",
            //----
            "permit-qr": "QR Code",
            "label-no": "Sticker No.",
            "label-type": "Sticker type",
            "owner-zone": "Parking zone",
            "owner-unit": "Unit no.",
            "owner-name": "Owner’s name",
            "owner-phone": "Phone number",
            "datetime-regist": "Regist. date",
            "date-expire": "Expiry date",
            "vehicle-type": "Vehicle type",
            "lp-no": "License plate no.",
            "lp-province": "Registered province",
            "btn-detail": "View more information",
            "btn-regist": "Register",
            "option": "-- Please select -- ",
            "option-province": "-- Please select province -- ",
            //-----

            //-----
            "caution": "If you need to update or change parking permit information,<br>please contact the juristic person office.",
            "disclaimer": "NICE SUITES II Juristic Person Office<br>5/169 Liap Mueang Nonthaburi Rd., Soi 14 Tha Sai, Mueang Nonthaburi Nonthaburi 11000 THAILAND",
            "notice": "The parking sticker is the property of the condominium juristic person.It is issued solely for the purpose of identifying authorized users in accordance with the condominium’s regulations. The holder does not possess ownership rights over the sticker. Transfer, sale, or use for any other purpose is strictly prohibited.The juristic person reserves the right to revoke or withdraw the sticker immediately in the event that the holder’s rights are terminated or any regulations are violated.",
            "lost": {
                "text": "This sticker has been reported lost.<br>Possession or use is prohibited.<br>Please return it to the Juristic Person Office immediately.",
                "label-no": "Sticker no. : ",
                "date-lost":"Lost date : "
            },
            "message": {
                "data-operate": {
                    "ing"   : "<h1>... Retriving ...</h1>",
                    "access": "<h1>... Accessing ...</h1>",
                    "error": "... An error occurred ...",
                    "not-allow": "... unautherize/wrong passkey ...",
                    "regist": "... Registrating, please wait ...",
                    "regist-cmp": "... Registration complete ...",
                },
                "vehicle-notfound": "Registed vehicles are not found.<br/>Please contact the juristic office.",
                "not-found": "Information from QR-Code is not found.<br />Please try again.",
                "password": "Please enter the user's password."
            },
            "option-value": {
                "vehicle-type": {
                    CAR : "Car",
                    BIKE:"Motorbike"
                },
                "owner-zone": {
                    BLD_A: "Building A",
                    BLD_B: "Building B",
                    BLD_C: "Building C",
                }
            }
        },
        "th-TH": {
            "title": "ParkQR Viewer - อาคารชุดไนซ์ สวีท - สนามบินน้ำ",
            "version": `ParkQR Viewer (เวอร์ชัน ${VERSION})`,
            "header01": "ข้อมูลผู้ใช้สิทธิ์จอดยานพาหนะ",
            "header02": "ลงทะเบียนสติกเกอร์ใหม่",
            "header03": "ข้อมูลเจ้าของร่วม/ผู้เช่า/ผู้ใช้สิทธิ์",
            "header-vehicle01": "ยานพาหนะ #1",
            "header-vehicle02": "ยานพาหนะ #2",

            "permit-qr": "รหัสคิวอาร์",
            "label-no": "ลำดับสติกเกอร์",
            "label-type": "ประเภทสติกเกอร์",
            "owner-zone": "อาคาร/โซนจอด",
            "owner-unit": "เลขที่ห้องชุด",
            "owner-name": "ชื่อเจ้าของร่วม",
            "owner-phone": "หมายเลขโทรศัพท์",
            "datetime-regist": "วันที่ลงทะเบียน",
            "date-expire": "วันหมดอายุ",
            "vehicle-type": "ประเภทยานพาหนะ",
            "lp-no": "เลขทะเบียน",
            "lp-province": "จังหวัดจดทะเบียน",
            "btn-detail": "รายละเอียดผู้ใช้สิทธิ์ฯเพิ่มเติม",
            "btn-regist" : "ลงทะเบียนสติกเกอร์",
            "option": "-- โปรดระบุ -- ",
            "option-province": "-- โปรดระบุจังหวัด -- ",

            //-----
            "caution": "ต้องการแก้ไขข้อมูลผู้รับสิทธิ์/ข้อมูลยานพาหนะ<br>กรุณาติดต่อสำนักงานนิติบุคคล<br>ในวันและเวลาทำการ",
            "disclaimer": "นิติบุคคลอาคารชุด ไนซ์สวีท 2 สนามบินน้ำ<br>เลขที่ 5/169 ถ.เลี่ยงเมืองนนทบุรี 14 ต.ท่าทราย อ.เมืองนนทบุรี<br>จ.นนทบุรี 11000",    
            "notice": "สติกเกอร์จอดรถเป็นทรัพย์สินของนิติบุคคลอาคารชุด ใช้เพื่อระบุตัวตนของผู้ได้รับสิทธิตามระเบียบนิติบุคคลเท่านั้น ผู้ครอบครองไม่มีสิทธิเป็นเจ้าของ ห้ามโอน ขาย หรือใช้ในวัตถุประสงค์อื่น นิติบุคคลขอสงวนสิทธิเรียกคืนหรือเพิกถอนการใช้ได้ทันที หากผู้ครอบครองสิ้นสิทธิหรือฝ่าฝืนข้อกำหนด",
            //-----
            "lost": {
                "text": "สติกเกอร์นี้ถูกลงบันทึกประจำวันแล้วว่าสูญหาย <br />การครอบครองหรือนำไปใช้งานต่อ<br />จะถือว่าไม่ชอบด้วยระเบียบของนิติบุคคล <br /> หากพบเห็นกรุณานำส่งสำนักงานนิติบุคคลทันที",
                "label-no": "สติกเกอร์หมายเลข : ",
                "date-lost": "วันที่แจ้งหาย : "
            },
            message: {
                "data-operate": {
                    "ing"   : "<h1>... กำลังค้นหา ...</h1>",
                    "access": "<h1>... กำลังเข้าถึงข้อมูล ...</h1>",
                    "error": "... เกิดข้อผิดพลาดในการดึงข้อมูล ...",
                    "not-allow": "... ไม่อนุญาติให้เข้าถึง/รหัสผ่านไม่ถูกต้อง ...",
                    "regist": "... กำลังบันทึกรายการ โปรดรอ ...",
                    "regist-inc": "... บันทึกรายการไม่สำเร็จ โปรดลองอีกครั้ง ...",
                    "regist-cmp": "... ลงทะเบียนสำเร็จ ...",
                },
                "vehicle-notfound":"ไม่พบข้อมูลยานพาหนะที่ลงทะเบียน<br>โปรดติดต่อสำนักงานนิติบุคคล",
                "lost": "สติกเกอร์นี้ถูกลงบันทึกประจำวันแล้วว่าสูญหาย <br />การครอบครองหรือนำไปใช้งานต่อ<br />จะถือว่าไม่ชอบด้วยระเบียบของนิติบุคคล <br /> หากพบเห็นกรุณานำส่งสำนักงานนิติบุคคลทันที",
                "not-found": "ไม่พบข้อมูลจากรหัสคิวอาร์โค้ดนี้<br />กรุณาตรวจสอบใหม่อีกครั้ง",
                "password": "โปรดระบุรหัสผ่าน"
            },
            "option-value": {
                "vehicle-type": {
                    CAR: "รถยนต์",
                    BIKE: "จักรยานยนต์"
                },
                "owner-zone": {
                    BLD_A: "อาคาร A",
                    BLD_B: "อาคาร B",
                    BLD_C: "อาคาร C",
                }
            }
        }
    }

    var I18N_CODE = "th-TH";
    var PARAM_IPADDR = "";    //เก็บข้อมูล ip-addr จากการดึงข้อมูล
    var PARAM_PERMIT_QR = ""; //เก็บข้อมูล qr-code จาก require-url

    function TTL_LOCALSTOREAGE(prefix) {
        const now = () => Date.now();
        //----
        return {
            set: function (key, value, ttlMs = 0) {
                const rec = { value, expiresAt: ttlMs ? now() + ttlMs : null, savedAt: now(), v: 1, };
                //----
                localStorage.setItem(prefix + key, JSON.stringify(rec));
            },
            get: function (key) {
                const raw = localStorage.getItem(prefix + key);

                if (!raw) return null;

                try {
                    const rec = JSON.parse(raw);
                    if (rec.expiresAt && now() > rec.expiresAt) {  // หมดอายุแล้ว—ลบทิ้ง      
                        localStorage.removeItem(prefix + key);
                        return null;
                    }

                    return rec.value;

                } catch (e) {   // ข้อมูลพัง—เคลียร์ทิ้ง
                    localStorage.removeItem(prefix + key);
                    return null;
                }
            },
            remove: function (key) {
                localStorage.removeItem(prefix + key);
            },
            sweep: function () {

                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    //-----
                    if (!k || !k.startsWith(prefix)) continue;

                    try {
                        const rec = JSON.parse(localStorage.getItem(k));
                        //-----
                        if (rec && rec.expiresAt && now() > rec.expiresAt) { localStorage.removeItem(k); }

                    } catch (e) {

                        localStorage.removeItem(k);
                    }
                }
            }
        };
    } 

    var ttlStore = new TTL_LOCALSTOREAGE(STORE_PREFIX + CODE_CLIENT);

    function Main() {
        let me = this;
        //-----
        me.init().render().reset().resetAll();
    }
    //-----
    Main.prototype = {
        constructor: Main,
        //-----
        component: {
            "body": "body",
            "container": 'div#container',
            "switchLanguage": {
                self:  "label.sw-lang",
                input: "input#lang-toggle",
                knob:  ".sw-lang-knob .abbr",
            },
            "infoArea00": '#info-area00',
            "infoArea01": '#info-area01',
            "infoArea02": '#info-area02',
            "infoLost": '#info-lost',
            "infoNotFound": '#info-notfound',
            "caution": '.caution',
            "form": {
                self: '#frm-regist',
                label_no: "input#label-no",
                permit_qr: "input.permit-qr",
                vehicle_type: "select#vehicle-type",
                owner_unit: "input#owner-unit",
                owner_zone: "select#owner-zone",
                owner_name: "input#owner-name",
                owner_phone: "input#owner-phone",
                //-----
                lp_province01: "select#lp-province-0",
                lp_no01: "input#lp-no-0",
                //-----
                submit: "button"
            }

        },
        //-----
        init: function () {
            let me = this;
            let cp = me.component;
            
            const init_component = function (cps) {
                let self = document;
                cps.forEach(function (val, key) {
                    if (val.isFunction()) return 0;
                    if (val.isObject()) { cps[key] = init_component(val); return 0; }
                    //-----
                    cps[key] = self.querySelector(val);
                    if (key == "self") self = cps[key];
                });
                return cps;

            }
            const init_switchlang = function (cps) {

                let curr_lang = localStorage.getItem(STORE_PREFIX + CODE_CLIENT + STORE_VALUE_PREF);

                cps.input.addEventListener('change', function (e) {
                    let isChecked = e.target.checked;
                    //-----
                    cp.body.classList.forEach(cn => { cn.startsWith("lang-") ? cp.body.classList.remove(cn) : "" });

                    isChecked && (() => {
                        cp.body.classList.add("lang-en");
                        cps.input.checked = true;
                        cps.input.setAttribute('aria-checked', 'true');
                        cps.input.setAttribute('aria-label', 'Switch to Thai');
                        cps.knob.textContent = "EN";
                    })();
                    (!isChecked) && (() => {
                        cp.body.classList.add("lang-th");
                        cps.input.checked = false;
                        cps.input.setAttribute('aria-checked', 'false');
                        cps.input.setAttribute('aria-label', 'Switch to English');
                        cps.knob.textContent = "TH";
                    })();

                    localStorage.setItem(STORE_PREFIX + CODE_CLIENT + STORE_VALUE_PREF, isChecked ? 'en-EN' : 'th-TH');

                    cps.self.dispatchEvent(new Event("toggle"));

                });

                cps.input.checked = curr_lang == "en-EN";
                cps.input.dispatchEvent(new Event('change'));

                cps.self.addEventListener("toggle", function (e) {
                    me.switch_language(localStorage.getItem(STORE_PREFIX + CODE_CLIENT + STORE_VALUE_PREF));
                });

                me.switch_language(curr_lang);

                return cps.self;

            }

            init_component(me.component);
            init_switchlang(me.component.switchLanguage)

            cp.body.addEventListener("onFetchData", function (e) { me.render_info(e.data); });

            PARAM_PERMIT_QR = (new URLSearchParams(window.location.search)).get(URLPARAM_QR);

            return this;
        },
        render: function () {
            

            return this;
        },
        reset: function () {
            let me = this;

            return {
                resetAll: function () {

                    let passkey = ttlStore.get(STORE_VALUE_PASSKEY);
                    passkey
                        ? me.fetch_data.private.call(me)
                        : me.fetch_data.public.call(me);   
                }
                
            };
        },
        //-----
        switch_language:function (lang){
            I18N_CODE = lang ? lang : I18N_CODE;

            let dtLang = undefined;
            let elements = document.querySelectorAll("[data-lang]");
            let res = "";

            elements.forEach(el => {
                dtLang  = I18N[I18N_CODE];
                let key = el.getAttribute('data-lang');
                //-----
                key = key.split('.');

                let res = "";
                key.forEach(function (k) {
                    if (k == "date") {
                        
                        value = el.getAttribute('data-value');
                        res = new Date(value).toLocaleDateString(I18N_CODE, FMT_DATELONG)
                        //-----
                        return 0;
                    }

                    if (!dtLang[k]) return 0;
                    if (dtLang[k].isObject()) { dtLang = dtLang[k]; return 0; }

                    res = dtLang[k];
                });

                if (res != "") {el.innerHTML = res;}
            });
        },
        //-----
        display_error: function(msg = "",data_lang="") {
            let cp = this.component;

            msg != "" && (function () {
                cp.infoArea00.innerHTML = msg == "" ? "" : `<div class="error" data-lang="${data_lang}">${msg}</div>`;
                cp.container.classList.remove("loader");
                cp.container.classList.add("error");
            })();

            msg == "" && (function () {
                cp.infoArea00.innerHTML = "";
                cp.container.classList.remove("error");
            })();

            this.switch_language();
            
            //-----
            return cp;                            
        },
        display_notfound: function () {
            let me = this;
            let cp = me.component;
            //------
            this.display_error("");
            //------
            cp.container.classList.add("not-found");
            cp.container.classList.remove("loader");
            cp.container.classList.add("ready");
            //-----
            this.switch_language();
        },
        display_lost: function (data) {
            let me = this;
            let cp = me.component;
            //-----
            cp.infoLost.innerHTML += ``;

            cp.infoLost.innerHTML = cp.infoLost.innerHTML + `
                <br><span data-lang="lost.label-no">สติกเกอร์หมายเลข</span>${data["label-no"]}
                <br><span data-lang="lost.date-lost">วันที่แจ้งหาย</span>${new Date(data["datetime-update"]).toLocaleDateString(I18N_CODE, FMT_DATESHORT)}`;
            me.display_error();

            cp.container.classList.add("lost");
            cp.container.classList.remove("loader");
            cp.container.classList.add("ready");
            
            this.switch_language();
        },
        //-----
        render_info: function (data, is_private = false) {
            let me = this;
            let cp = me.component;

            cp.form.self.style.display = "none";
            cp.caution.style.display = "none";

            function render_item(caption = "", value = "", clang_key = "",vlang_key = "", itemClass = "", valueClass = '', item_type = undefined) {

                if (value == undefined || value == null) return "";
                if (value.toString().trim() == "") return "";
                //-----                                        
                let display_value = value;
                //-----
                if (item_type == "a") display_value = `<a href="tel:${value.replace(/\D/g, '')}">${value}</a>`;
                if (item_type == "date") {
                    const opt_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                    display_value = `<span data-lang="date" data-value="${value}">${new Date(value).toLocaleDateString(I18N_CODE, FMT_DATELONG)}</span>`;
                }                       

                return `
                    <div class="item ${itemClass}">
                        <div class="label" data-lang = "${clang_key}">${caption}</div>
                        <div class="value ${valueClass}" data-lang = "${vlang_key}">${display_value}</div>
                    </div>`;

            }

            cp.infoArea01.innerHTML = `
                <h1 data-lang="header01">ข้อมูลผู้ใช้สิทธิ์จอดยานพาหนะ</h1>
                ${render_item("รหัสคิวอาร์"    , data["permit-qr"] , "permit-qr")}
                ${render_item("ลำดับสติกเกอร์", data["label-no"], "label-no")}

                ${render_item("ประเภท", I18N.get_text("option-value.vehicle-type." + data["vehicle-type"]),
                        "label-type", "option-value.vehicle-type."+ data["vehicle-type"])}

                ${render_item("อาคาร/โซนจอดฯ", I18N[I18N_CODE]["option-value"]["owner-zone"][data["owner-zone"]], "owner-zone")}

                ${render_item("เลขที่ห้องชุด", data["owner-unit"], "owner-unit")}
                ${render_item("ชื่อเจ้าของร่วมฯ", data["owner-name"], "owner-name")}
                ${render_item("หมายเลขโทรศัพท์", data["owner-phone"], "owner-phone", "","", "phone", "a")}

                ${data["is-regist"] && render_item("วันลงทะเบียน", data["datetime-regist"], "datetime-regist","","","","date")}
                ${data["is-regist"] && render_item("วันหมดอายุ", data["date-expire"], "date-expire","", "", "expired","date")}

                ${render_item("หมายเหตุ", data["remark"], "remark")}

                ${(is_private ? "" : `<button id="btn-detail" data-lang="btn-detail">รายละเอียดผู้ใช้สิทธิ์ฯเพิ่มเติม</button>`)}
            `;

            cp.infoArea02.innerHTML = "";

            var vItems = "";

            if (!data["vehicles"].length) vItems = '<h2 data-lang="message.vehicle-notfound">ไม่พบข้อมูลยานพาหนะที่ลงทะเบียน</h2>';

            data["vehicles"].forEach(function (r, idx) {
                vItems += `
                    <h2 data-lang = "header-vehicle0${idx + 1}">ยานพาหนะ #${idx + 1}</h2>
                    ${render_item(
                        "ประเภท"
                        , I18N.get_text("option-value.vehicle-type." + r["vehicle-type"])
                        , "vehicle-type"
                        , "option-value.vehicle-type." + (r["vehicle-type"])
                        ,  "vehicle-type-" + (r["vehicle-type"] == "BIKE" ? "bike" : "car") + (idx + 1)
                        )}
                    ${render_item("เลขทะเบียน", r["lp-no"], "lp-no")}
                    ${render_item("จังหวัดจดทะเบียน", r["lp-province"], "lp-province")}
                `;
            });

            cp.infoArea02.innerHTML = vItems;

            !is_private && document
                .querySelector("button#btn-detail")
                .addEventListener("click", function (e) { me.fetch_data.private.call(me); });

            cp.caution.style.display = "block";

            let date_current = new Date();
            let date_expire = new Date(data["date-expire"]);
            let is_expire = date_current.getMonth() === date_expire.getMonth() && date_current.getFullYear() === date_expire.getFullYear(); 
            //-----
            is_expire ? cp.body.classList.add("expire") : cp.body.classList.remove("expire");

            this.display_error();
            
        },
        render_form: function (data) {
            let me = this;
            let cp = me.component;

            cp.infoArea00.innerHTML = "";
            cp.infoArea01.innerHTML = "";
            cp.infoArea02.innerHTML = "";

            var cpf = cp.form;

            cpf.vehicle_type.addEventListener("change", function (e) {
                let value = this.value;
                let el = cp.form.self
                //-----
                el.classList.remove("vehicle-type-");
                el.classList.remove("vehicle-type-car");
                el.classList.remove("vehicle-type-bike");
                el.classList.add("vehicle-type-" + value.toLowerCase());
            });

            cpf.self.addEventListener('submit', async function (e) {
                e.preventDefault();
                //-----
                me.display_error(I18N.get_text("message.data-operate.regist"), "message.data-operate.regist")

                cp.form.label_no.disabled = false;
                cp.form.vehicle_type.disabled = false;
              
                const form = e.target;
                const formData = new FormData(form);
                //----
                let data = formData.entries(); // แปลง FormData เป็น Object

                for (let [key, val] of data) {
                    const match = key.match(/^vehicles\[(\d+)\]\[(.+)\]$/);
                    //-----
                    if (match) {
                        const index = parseInt(match[1], 10);
                        const field = match[2];
                        if (!data["vehicles"]) { data["vehicles"] = []; }
                        if (!data["vehicles"][index]) { data["vehicles"][index] = {}; }
                        data["vehicles"][index][field] = val;
                    } else {
                        data[key] = val;
                    }

                }

                me.fetch_data.regist.call(me,data);

            });

            cpf.label_no.value = data["label-no"] || '';
            //-----
            cpf.vehicle_type.value = data["vehicle-type"] || '';
            cpf.vehicle_type.dispatchEvent(new Event("change"));

            cpf.permit_qr.value = PARAM_PERMIT_QR;
            //----
            cpf.owner_zone.value = data["owner-zone"] || '';
            cpf.owner_unit.value = data["owner-unit"] || '';
            cpf.owner_name.value = data["owner-name"] || '';
            cpf.owner_phone.value = data["owner-phone"] || '';

            //-----
            cpf.vehicle_type.required = true;
            cpf.label_no.required = true;
        
            let is_enable = data["label-no"] != "" && data["vehicle-type"] != "";

            cpf.label_no.disabled = is_enable;
            cpf.vehicle_type.disabled = is_enable;
            cpf.lp_no01.required = is_enable;
            cpf.lp_province01.required = is_enable;
            cpf.owner_unit.required = is_enable;
            cpf.owner_name.required = is_enable
            cpf.owner_phone.required = is_enable
            //cpf.owner_zone.required = is_enable

            cpf.self.style.display = "block";
            cp.container.classList.remove("loader");
            cp.container.classList.add("ready");
        },
        //-----
        fetch_data: {

            /**
             *  ดึงข้อมูล ipaddress จากการเรียกข้อมูล
             * @returns
             */
            ipaddr: async function () {

                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), TIMEOUT_FETCH);

                try {
                    const response = await fetch("https://api.ipify.org?format=json", {
                        signal: controller.signal
                    });

                    clearTimeout(tid);

                    const res = await response.json();
                    //-----
                    return res["ip"] ? res["ip"] : undefined;

                } catch (e) {

                    clearTimeout(tid);

                    return "";
                }
            },
            
            public: async function () {

                let me = this;
                let cp = me.component;

                if (cp.container.classList.contains("loader")) return 0;
                //-----
                cp.container.classList.remove("lost");

                me.display_error(I18N.get_text("message.data-operate.ing"), "message.data-operate.ing");

                //-----
                cp.infoArea01.innerHTML = "";
                cp.infoArea02.innerHTML = "";

                cp.container.classList.add("loader");
                //-----
                window.scrollTo({ top: 0, behavior: 'smooth' });

                PARAM_IPADDR = PARAM_IPADDR != "" ? PARAM_IPADDR : await me.fetch_data.ipaddr.call(me);

                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), TIMEOUT_FETCH);

                try {

                    const response = await fetch(`${URL_API}`, {
                        signal: controller.signal,
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({
                            "version-client": VERSION,
                            "code-client"   : CODE_CLIENT,
                            "action"        : API_ACTION["permit-public"], 
                            "user-agent"    : navigator.userAgent,
                            "ip-addr"       : PARAM_IPADDR,
                            "opt-direct": OPT_DIRECT,
                            //-----
                            "permit-qr"     : PARAM_PERMIT_QR
                        })
                    });

                   
                    clearTimeout(tid);
                    //-----
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    me.display_error(); //clear message

                    const res = await response.json();

                    if (!res) { me.display_error(I18N.get_text("message.data-operate.error"), "message.data-operate.error"); return; }
                    //-----
                    if (res && res.status == "fail") { me.display_notfound();  return; }
                    if (res && res.status == "") { me.display_notfound();  return; }
                    //-----
                    if (!res.data) { me.display_notfound(); return; }

                    if (res.data["is-lost"]) { me.display_lost(res.data); return 0;}
                    if (!res.data["is-regist"]) { me.render_form(res.data); return 0; }

                    me.render_info(res.data);

                    cp.container.classList.remove("loader");
                    cp.container.classList.add("ready");
                } catch (e) {

                    clearTimeout(tid);
                    console.log(e.message);

                    me.display_error(I18N.get_text("message.data-operate.error"), "message.data-operate.error");
                    cp.container.classList.remove("loader");

                }
                
            },
            private: async function () {

                let me = this;
                let cp = me.component;
                //-----
                let key = ttlStore.get(STORE_VALUE_PASSKEY);  //อ่านข้อมุล pass-key จาก localstorage

                if (cp.container.classList.contains("loader")) return 0;
                //-----
                key = key ? key : prompt(I18N.get_text("message.password"));
                if (key == "" || !key) return 0;   
                //-----
                window.scrollTo({ top: 0, behavior: 'smooth' });
                //-----
                cp.infoArea01.innerHTML == ""
                    ? me.display_error(I18N.get_text("message.data-operate.ing"), "message.data-operate.ing")
                    : me.display_error(I18N.get_text("message.data-operate.access"), "message.data-operate.access");

                cp.container.classList.add("loader");

                PARAM_IPADDR = PARAM_IPADDR != "" ? PARAM_IPADDR:  await me.fetch_data.ipaddr.call(me);

                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), TIMEOUT_FETCH);

                try {

                    const response = await fetch(`${URL_API}`, {
                        signal: controller.signal,
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({
                            "version-client": VERSION,
                            "code-client"   : CODE_CLIENT,
                            "action"        : API_ACTION["permit-private"],
                            "user-agent"    : navigator.userAgent,
                            "ip-addr"       : PARAM_IPADDR,
                            "opt-direct"    : OPT_DIRECT,
                            //-----
                            "permit-qr"     : PARAM_PERMIT_QR,
                            "user-key"      : key
                        })
                    });

                    clearTimeout(tid);
                    //-----
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    me.display_error();

                    const res = await response.json();

                    if (!res) {
                        me.display_error(I18N.get_text("message.data-operate.error"), "message.data-operate.error");
                        return;
                    }

                    if (res && res.status == "fail") {
                        me.display_error(I18N.get_text("message.data-operate.not-allow"), "message.data-operate.not-allow");
                        return;
                    }

                    if (!res.data) {
                        me.display_notfound();
                        return;
                    }

                    if (!res.data["is-regist"]) {
                        me.render_form(res.data);
                        return 0;
                    }

                    if (res.data["is-lost"]) {
                        me.display_lost(res.data);
                        return 0;
                    }


                    me.render_info(res.data, true);

                    !ttlStore.get(STORE_VALUE_PASSKEY) && ttlStore.set(STORE_VALUE_PASSKEY, key, STORE_TTL_PASSKEY);

                    cp.container.classList.remove("loader");
                    cp.container.classList.add("ready");

                } catch (e) {
                    clearTimeout(tid);
                    //----
                    console.log(e.message);
                    //----
                    this.display_error(I18N.get_text("message.data-operate.error"));
                    cp.container.classList.remove("loader");
                }

            },
            /**
             * API:สำหรับการกรอกข้อมูลเพิ่มลงทะเบียนสติกเกอร์
             * @param {any} data
             * @returns
             */
            regist: async function(data) {
                let me = this;
                let cp = me.component;

                try {

                    me.display_error(I18N.get_text("message.data-operate.regist"), "message.data-operate.regist");
                    //-----
                    cp.container.classList.add("loader");
                    //-----
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    PARAM_IPADDR = PARAM_IPADDR != "" ? PARAM_IPADDR : await me.fetch_data.ipaddr.call(me);

                    data["version-client"]  = VERSION;
                    data["code-client"]     = CODE_CLIENT;
                    data["action"]          = API_ACTION["permit-regist"];
                    data["user-agent"]      = navigator.userAgent
                    data["ip-addr"]         = PARAM_IPADDR
                    data["permit-qr"]       = PARAM_PERMIT_QR

                    const response = await fetch(`${URL_API}`, {
                        method: 'POST',
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify(data)
                    });

                    const res = await response.json();

                    if (res && res.status == "fail") {
                        me.display_error(I18N.get_text("message.data-operate.regist-inc"), "message.data-operate.regist-inc");
                    }
                    if (res && res.status == "not-found") { me.display_error(`...${res.message}...`); return;}
                    if (res && res.status == "conflict")  { me.display_error(`...${res.message}...`); return; }

                    me.display_error(I18N.get_text("message.data-operate.regist-cmp"), "message.data-operate.regist-cmp");

                    res.data["is-regist"]
                        ? me.render_info(res.data, true)
                        : me.render_form(res.data);

                    cp.container.classList.remove("loader");

                } catch (e) {
                    console.log(e.message);
                    //-----
                    cp.container.classList.remove("loader");
                    me.display_error(I18N.get_text("message.data-operate.regist-inc"), "message.data-operate.regist-inc");
                }
            }
        }
    }

    return Main;

})());

NS("App.Module", INSTANCE, new (NS(NAMESPACE, NAMECLASS))());


/**
 * HISTORY
 * 
 * 20251222:2.0.5
 * - Added : เพิ่มการตรวจสอบวันหมดอายุ ถ้าอยู่ในเดือนเดียวกัน ให้ เพิ่มคลาส body.expire
 * 
 * 20251114:2.0.4
 * - Moded : แก้ไขเวลาของ localstorage:key เป็น 4 ชั่วโมง
 * 
 * 20251112:2.0.3
 * - Added : เพิ้มการส่งค่า version-client กลับไปยัง server เพื่อบันทึกข้อมูล
 * - Fixed : แก้ไขข้อความแสดงผล "รหั่สผ่านไม่ถูกต้อง"
 * 
 * 20251107:2.0.2
 * - Fixed : แก่้ไขการแสดงข้อมูล เมื่อป้อนข้อมูลลงทะเบียนแค่เลขที่และประเภทสติกเกอร์ ให้กลับมาแสดง form ใหม่อีกครั้ง
 * 
 * 20251105:2.0.1
 * - Added : เพิ่มการส่งข้อมูลรหัสของนิติบุคคล (code-client) เพื่อรองรับการรวมตารางในอนาคต กรณีใช้ api เดียวกัน 
 * - Fixed : เพิ่มการรวม code-client กับ STORE_PREFIX ใน localstorage รองรับการใช้งานหลาย client และ การป้อน pass-key เดียวกันในแต่ละ client
 * 
 * 20251103:2.0.0
 * - Moded : เปลี่ยนโครงสร้างโค็ดเดิม เป็นแบบ namespace-class-object 
 * - Added : เพิ่มการแสดงผลแบบสองภาษา เก็บการตั้งค่าภาษาที่เลือกครั้งแรกไว้ใน localstorage
 * - Moded : เปลี่ยน UI ส่วนของสี แยกเป็นตัวแปรใน SCSS ง่ายต่อการแก้ไขในอนาคต 
 * - Moded : เพิ่มฟังก์ชันการนับ timeout สำหรับการ fetch ข้อมูลทุก API
 * 
 * 
 */



