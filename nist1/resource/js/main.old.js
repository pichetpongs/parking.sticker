

function NS(ns, name, fn) {
    ns = ns.split('.');
    if (!ns.length) return 0;

    var el = this;
    ns.forEach(function (v, index) {
        el[v] = el[v] || {};
        el = el[v];
    });

    if (fn) el[name] = fn;

    return el[name];
}



var App = App || {};


const NAMESPACE = 'App.Class.Module';
const NAMECLASS = 'Main';
//-----
const INSTANCE  = 'Viewer';

NS(NAMESPACE, NAMECLASS, (() => {

    const OPT_DIRECT = false;

    const URL_API = "https://script.google.com/macros/s/AKfycbyVtPa9o1sbeRkbBjiU4HNP98h9RvO8nsDRouD8l87Qz851en8isAlxSiyv7NvwwiHGBA/exec?channel=web";

    const STORE_PREFIX          = "app.parkqr:";
    const STORE_VALUE_PREF      = "pref-lang";
    const STORE_VALUE_PASSKEY   = "passkey"

    const STORE_TTL_PASSKEY = 2 * 60 * 60 * 1000;
    const URLPARAM_QR = "c";

    const LANGUAGE = {
        get_text: (code) => {

            let lang = LANGUAGE[LANGUAGE_CODE];
            let ns = code.split('.');
            let res
            ns.forEach(function (n) {
                if (!lang[n]) {  return 0; }
                if (lang[n].isObject()) { lang = lang[n]; return 0;}
                //-----
                res = lang[n];
                
            });

            return res;
        },

        "en-EN": {
            "version": "ParkQR Viewer (version 2.0)",
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
            "datetime-regist": "Registration date",
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
            "disclaimer": "METROLUXE Kaset Condominium Juristic Person Office<br>39 Phahonyothin, Sena Nikhom Subdistrict,<br>Chatuchak District, Bangkok 10900",
            "notice": "The parking sticker is the property of the condominium juristic person.It is issued solely for the purpose of identifying authorized users in accordance with the condominium’s regulations. The holder does not possess ownership rights over the sticker. Transfer, sale, or use for any other purpose is strictly prohibited.The juristic person reserves the right to revoke or withdraw the sticker immediately in the event that the holder’s rights are terminated or any regulations are violated.",
            "lost": {
                "text": "This sticker has been reported lost.<br>Possession or use is prohibited.<br>Please return it to the Juristic Person Office immediately.",
                "label-no": "Sticker No. : ",
                "date-lost":"Date Lost : "
            },
            "message": {
                "data-operate": {
                    "ing"   : "<h1>... Retriving ...</h1>",
                    "access": "<h1>... Accessing ...</h1>",
                    "error": "...An error occurred...",
                    "not-allow": "... unautherize/wrong passkey ...",
                    "regist": "...Registrating, please wait...",
                    "regist-cmp": "...Registration complete...",
                },
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
            "version": "ParkQR Viewer (เวอร์ชัน 2.0)",
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
            "caution": "หากต้องการ แก้ไข/เปลี่ยนแปลง ข้อมูลผู้รับสิทธิ์, ข้อมูลยานพาหนะ<br>กรุณาติดต่อสำนักงานนิติบุคคล ในวันและเวลาทำการ",
            "disclaimer": "นิติบุคคลอาคารชุดเมโทรลักซ์-เกษตร<br>39 ถนนประเสริฐมนูกิจ แขวงเสนานิคม เขตจตุจักร<br>กรุงเทพมหานคร 10900",    
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
                    "not-allow": "... ไม่อนุญาติให้เข้าถึง/รหัสผืดพลาด ...",
                    "regist": "...กำลังบันทึกรายการ โปรดรอ...",
                    "regist-inc": "...บันทึกรายการไม่สำเร็จ โปรดลองอีกครั้ง...",
                    "regist-cmp": "...ลงทะเบียนสำเร็จ...",
                },
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

    var LANGUAGE_CODE = "th-TH";
    var IPADDR = "";
    var PARAM_PERMIT_QR = "";

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

    var ttlStore = new TTL_LOCALSTOREAGE(STORE_PREFIX);

    function Main() {
        let me = this;
        //-----
        me.init().render().reset().resetAll();
    }
    //-----
    Main.prototype = {
        constructor: Main,
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

                let curr_lang = localStorage.getItem(STORE_PREFIX + STORE_VALUE_PREF);

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

                    localStorage.setItem(STORE_PREFIX + STORE_VALUE_PREF, isChecked?'en-EN':'th-TH');

                    cps.self.dispatchEvent(new Event("toggle"));

                });

                cps.input.checked = curr_lang == "en-EN";
                cps.input.dispatchEvent(new Event('change'));

                cps.self.addEventListener("toggle", function (e) {
                    me.switch_language(localStorage.getItem(STORE_PREFIX + STORE_VALUE_PREF));
                });

                me.switch_language(curr_lang);

                return cps.self;

            }

            init_component(me.component);
            init_switchlang(me.component.switchLanguage)

            cp.body.addEventListener("onFetchData", function (e) { me.render_info(e.data); });

            me.fetchData.ipaddr().then(x => { IPADDR = x; });

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
                        ? me.fetchData.private.call(me)
                        : me.fetchData.public.call(me);   
                }
                
            };
        },

        switch_language: (lang) => {
            LANGUAGE_CODE = lang ? lang : LANGUAGE_CODE;

            let dtLang = undefined;
            let elements = document.querySelectorAll("[data-lang]");
            let res = "";

            elements.forEach(el => {
                dtLang  = LANGUAGE[LANGUAGE_CODE];
                let key = el.getAttribute('data-lang');
                //-----
                key = key.split('.');

                let res = "";
                key.forEach(function (k) {
                    if (!dtLang[k]) return 0;
                    if (dtLang[k].isObject()) { dtLang = dtLang[k]; return 0; }
                    res = dtLang[k];
                });

                if (res != "") {el.innerHTML = res;}
            });
        },

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

            infoLost.innerHTML = infoLost.innerHTML + `
                <br><span data-lang="lost.label-no">สติกเกอร์หมายเลข</span>${data["label-no"]}
                <br><span data-lang="lost.date-lost">วันที่แจ้งหาย</span>${new Date(data["datetime-update"]).toLocaleDateString(LANGUAGE_CODE, { 
                    year: 'numeric',     // แสดงปีแบบ 4 หลัก
                    month: 'short',       // แสดงชื่อเดือน (กันยายน)
                    day: 'numeric'
                })}`;
            cp.container.classList.add("lost");
            cp.container.classList.remove("loader");
            cp.container.classList.add("ready");

            this.switch_language();
        },

        render_info: function (data, is_private = false) {
            let me = this;
            let cp = me.component;

            cp.form.self.style.display = "none";
            cp.caution.style.display = "none";

            function render_item(caption = "", value = "", clang_key = "",vlang_key = "", itemClass = "", valueClass = '', item_type = undefined) {

                if (value.toString().trim() == "") return "";
                //-----                                        
                let display_value = value;
                //-----
                if (item_type == "a") display_value = `<a href="tel:${value.replace(/\D/g, '')}">${value}</a>`;

                return `
                    <div class="item ${itemClass}">
                        <div class="label" data-lang = "${clang_key}">${caption}</div>
                        <div class="value ${valueClass}" data-lang = "${vlang_key}">${display_value}</div>
                    </div>`;

            }


            const opt_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            infoArea01.innerHTML = `
                <h1 data-lang="header01">ข้อมูลผู้ใช้สิทธิ์จอดยานพาหนะ</h1>
                ${render_item("รหัสคิวอาร์"    , data["permit-qr"] , "permit-qr")}
                ${render_item("ลำดับสติกเกอร์", data["label-no"], "label-no")}

                ${data["vehicles"].length
                    && render_item("ประเภท", LANGUAGE.get_text("option-value.vehicle-type." + data["vehicle-type"]),
                        "label-type", "option-value.vehicle-type."+ data["vehicle-type"])}

                ${render_item("อาคาร/โซนจอดฯ", LANGUAGE[LANGUAGE_CODE]["option-value"]["owner-zone"][data["owner-zone"]], "owner-zone")}

                ${render_item("เลขที่ห้องชุด", data["owner-unit"], "owner-unit")}
                ${render_item("ชื่อเจ้าของร่วมฯ", data["owner-name"], "owner-name")}
                ${render_item("หมายเลขโทรศัพท์", data["owner-phone"], "owner-phone", "","", "phone", "a")}

                ${data["is-regist"] && render_item("วันลงทะเบียน", new Date(data["datetime-regist"]).toLocaleDateString(LANGUAGE_CODE, opt_date), "datetime-regist")}
                ${data["is-regist"] && render_item("วันหมดอายุ", new Date(data["date-expire"]).toLocaleDateString(LANGUAGE_CODE, opt_date), "date-expire","", "", "expired")}

                ${render_item("หมายเหตุ", data["remark"], "remark")}

                ${(is_private ? "" : `<button id="btn-detail" data-lang="btn-detail">รายละเอียดผู้ใช้สิทธิ์ฯเพิ่มเติม</button>`)}
            `;

            infoArea02.innerHTML = "";

            var vItems = "";
            data["vehicles"].forEach(function (r, idx) {
                vItems += `
                    <h2 data-lang = "header-vehicle0${idx + 1}">ยานพาหนะ #${idx + 1}</h2>
                    ${render_item(
                        "ประเภท"
                        , LANGUAGE.get_text("option-value.vehicle-type." + r["vehicle-type"])
                        , "vehicle-type"
                        , "option-value.vehicle-type." + (r["vehicle-type"])
                        ,  "vehicle-type-" + (r["vehicle-type"] == "BIKE" ? "bike" : "car") + (idx + 1)
                        )}
                    ${render_item("เลขทะเบียน", r["lp-no"], "lp-no")}
                    ${render_item("จังหวัดจดทะเบียน", r["lp-province"], "lp-province")}
                `;
            });

            infoArea02.innerHTML = vItems != "" ? vItems : '<h2 data-lang="vehicle-notfound">ไม่พบข้อมูลยานพาหนะที่ลงทะเบียน</h2>';


            !is_private && document
                .querySelector("button#btn-detail")
                .addEventListener("click", function (e) { me.fetchData.private.call(me); });

            cp.caution.style.display = "block";

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
                me.display_error(LANGUAGE.get_text("message.data-operate.regist"), "message.data-operate.regist")

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

                me.fetchData.regist.call(me,data);

            });

            cpf.label_no.value = data["label-no"] || '';
            //-----
            cpf.vehicle_type.value = data["vehicle-type"] || '';
            cpf.vehicle_type.dispatchEvent(new Event("change"));

            cpf.permit_qr.value = PARAM_PERMIT_QR;

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

            cpf.self.style.display = "block";
            cp.container.classList.remove("loader");
            cp.container.classList.add("ready");
        },


        fetchData: {

            ipaddr: async function () {
                const response = await fetch("https://api.ipify.org?format=json");
                const res = await response.json();
                //-----
                return res["ip"] ? res["ip"] : undefined;
            },
            
            public: async function () {

                let me = this;
                let cp = me.component;

                try {

                    if (cp.container.classList.contains("loader")) return 0;
                    //-----
                    cp.container.classList.remove("lost");

                    me.display_error(LANGUAGE.get_text("message.data-operate.ing"), "message.data-operate.ing");

                    //-----
                    cp.infoArea01.innerHTML = "";
                    cp.infoArea02.innerHTML = "";

                    cp.container.classList.add("loader");
                    //-----
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    IPADDR = await me.fetchData.ipaddr.call(me);

                    const response = await fetch(`${URL_API}`, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({
                            "user-agent": navigator.userAgent,
                            "ip-addr": IPADDR,
                            "opt-direct": OPT_DIRECT,
                            "action": "permit-public", 
                            "permit-qr": PARAM_PERMIT_QR
                        })
                    });

                    const res = await response.json();

                    me.display_error(); //clear message

                    if (!res) { me.display_error(LANGUAGE.get_text("message.data-operate.error"), "message.data-operate.error"); return; }
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
                    console.log(e.message);

                    me.display_error(LANGUAGE.get_text("message.data-operate.error"), "message.data-operate.error");
                    cp.container.classList.remove("loader");
                    
                }
            },
            private: async function () {

                let me = this;
                let cp = me.component;
                //-----
                let key = ttlStore.get(STORE_VALUE_PASSKEY);

                try {

                    if (cp.container.classList.contains("loader")) return 0;
                    //-----
                    key = key ? key : prompt(LANGUAGE.get_text("message.password"));
                    if (key == "" || !key) return 0;
                    //-----
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    //-----
                    cp.infoArea01.innerHTML == ""
                        ? me.display_error(LANGUAGE.get_text("message.data-operate.ing"), "message.data-operate.ing")
                        : me.display_error(LANGUAGE.get_text("message.data-operate.access"), "message.data-operate.access");

                    cp.container.classList.add("loader");

                    IPADDR = await me.fetchData.ipaddr.call(me);

                    const response = await fetch(`${URL_API}`, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({
                            "user-agent": navigator.userAgent,
                            "ip-addr": IPADDR,
                            "opt-direct": OPT_DIRECT,
                            "action": "permit-private",
                            "permit-qr": PARAM_PERMIT_QR,
                            "user-key": key
                        })
                    });

                    const res = await response.json();

                    if (!res) {
                        me.display_error(LANGUAGE.get_text("message.data-operate.error"), "message.data-operate.error");
                        return;
                    }

                    if (res && res.status == "fail") {
                        me.display_error(LANGUAGE.get_text("message.data-operate.not-allow"), "message.data-operate.not-allow");
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
                        me.showLost(res.data);
                        return 0;
                    }


                    me.render_info(res.data, true);

                    !ttlStore.get(STORE_VALUE_PASSKEY) && ttlStore.set(STORE_VALUE_PASSKEY, key, STORE_TTL_PASSKEY);

                    cp.container.classList.remove("loader");
                    cp.container.classList.add("ready");

                } catch (e) {
                    console.log(e.message);

                    this.display_error(LANGUAGE.get_text("message.data-operate.error"));
                    cp.container.classList.remove("loader");
                }

            },
            regist: async function(data) {
                let me = this;
                let cp = me.component;

                try {

                    me.display_error(LANGUAGE.get_text("message.data-operate.regist"), "message.data-operate.regist");
                    //-----
                    cp.container.classList.add("loader");
                    //-----
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    data["action"]      = "permit-regist";
                    data["ip-addr"]     = IPADDR
                    data["user-agent"]  = navigator.userAgent
                    data["permit-qr"]   = PARAM_PERMIT_QR

                    const response = await fetch(`${URL_API}`, {
                        method: 'POST',
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify(data)
                    });

                    const res = await response.json();

                    if (res && res.status == "fail") {
                        me.display_error(LANGUAGE.get_text("message.data-operate.regist-inc"), "message.data-operate.regist-inc");
                    }
                    if (res && res.status == "not-found") { me.display_error(`...${res.message}...`); return;}
                    if (res && res.status == "conflict")  { me.display_error(`...${res.message}...`); return; }

                    me.display_error(LANGUAGE.get_text("message.data-operate.regist-cmp"), "message.data-operate.regist-cmp");
                    
                    me.render_info(res.data, true);
                    cp.container.classList.remove("loader");

                } catch (e) {
                    console.log(e.message);
                    //-----
                    cp.container.classList.remove("loader");
                    me.display_error(LANGUAGE.get_text("message.data-operate.regist-inc"), "message.data-operate.regist-inc");
                }
            }
        }

    }

    return Main;

})());


NS("App.Module", INSTANCE, new (NS(NAMESPACE, NAMECLASS))());




const infoArea00 = document.getElementById('info-area00');
const infoArea01 = document.getElementById('info-area01');
const infoArea02 = document.getElementById('info-area02');
const infoLost = document.getElementById('info-lost');
const infoNotFound = document.getElementById('info-notfound');
const cautionArea = document.getElementById('caution-area');
const container  = document.getElementById('container');
const frmRegist  = document.getElementById('frm-regist');


const URL_API = "https://script.google.com/macros/s/AKfycbyVtPa9o1sbeRkbBjiU4HNP98h9RvO8nsDRouD8l87Qz851en8isAlxSiyv7NvwwiHGBA/exec?channel=web";

const TTLStore = (() => {
    const NS = 'app:parkqr:'; // กันชนชื่อ key
    const now = () => Date.now();
    //-----             
    function set(key, value, ttlMs) {
        const rec = { value,  expiresAt: ttlMs ? now() + ttlMs : null, savedAt: now(), v: 1,};
        localStorage.setItem(NS + key, JSON.stringify(rec));
    }

    function get(key) {
        const raw = localStorage.getItem(NS + key);
        if (!raw) return null;

        try {
            const rec = JSON.parse(raw);
            if (rec.expiresAt && now() > rec.expiresAt) {  // หมดอายุแล้ว—ลบทิ้ง      
                localStorage.removeItem(NS + key);
                return null;
            }

            return rec.value;

        } catch(e) {   // ข้อมูลพัง—เคลียร์ทิ้ง
            localStorage.removeItem(NS + key);
            return null;
        }
    }

    function remove(key) {
        localStorage.removeItem(NS + key);
    }

    // เอาไว้เรียกเป็นครั้งคราว เพื่อล้าง key ที่หมดอายุ (ถ้ามีเยอะ)
    function sweep() {
        const prefix = NS;
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith(prefix)) continue;

            try {
                const rec = JSON.parse(localStorage.getItem(k));
                if (rec && rec.expiresAt && now() > rec.expiresAt) {localStorage.removeItem(k); }

            } catch (e) {

                localStorage.removeItem(k);
            }
        }
    }

    return { set, get, remove, sweep };
})();

const LANGUAGE = {
    "en-EN": {
        "header01": "Parking Permit Holder Information",
        "header-vehicle01": "Vehicle #1",
        "header-vehicle02": "Vehicle #2",
        "permit-qr": "QR Code",
        "label-no": "label No.",
        "owner-zone": "Parking zone",
        "owner-unit": "Unit No.",
        "owner-name": "Owner’s Name",
        "owner-phone": "Phone Number",
        "datetime-regist": "Registration Date",
        "date-expire": "Expiry Date",
        "vehicle-type": "Type",
        "lp-no"  : "License Plate No.",
        "lp-province": "Registered Province",
        "btn-detail" : "View more information",
        "caution": "If you need to update or change parking permit information,<br>please contact the juristic person office.",
        "disclaimer": "METROLUXE Kaset Condominium Juristic Person Office<br>39 Phahonyothin 34 Alley, Sena Nikhom Subdistrict,<br>Chatuchak District, Bangkok 10900",
        "notice": "The parking sticker is the property of the condominium juristic person.It is issued solely for the purpose of identifying authorized users in accordance with the condominium’s regulations. The holder does not possess ownership rights over the sticker. Transfer, sale, or use for any other purpose is strictly prohibited.The juristic person reserves the right to revoke or withdraw the sticker immediately in the event that the holder’s rights are terminated or any regulations are violated."
    },
    "th-TH": {
        "header01": "ข้อมูลผู้ใช้สิทธิ์จอดยานพาหนะ",
        "header-vehicle01": "ยานพาหนะ #1",
        "header-vehicle02": "ยานพาหนะ #2",

        "permit-qr": "รหัสคิวอาร์",
        "label-no":"ลำดับสติกเกอร์"
    }
}


const render_item = (label, value="", fieldName= "", itemClass="" , valueClass = '',type=undefined) => {
    if (value.toString().trim() == "" ) return "";
    //-----                                        
    let display_value = value;
    if(type == "a") display_value = `<a href="tel:${value.replace(/\D/g, '')}">${value}</a>`;

    return `<div class="item ${itemClass}">
            <div class="label" data-lang = "${fieldName}">${label}</div>
            <div class="value ${valueClass}" data-lang = "${fieldName}">${display_value}</div>
            </div>`;
};

const showError = (msg = "") => {
    infoArea00.innerHTML = msg == ""?"":`<div class="error">${msg}</div>`;
    container.classList.remove("loader");
};

const showLost = (data) => {
    infoLost.innerHTML = infoLost.innerHTML + `
    <br> สติกเกอร์หมายเลข ${data["label-no"]}
    <br> วันที่แจ้งหาย ${new Date(data["datetime-update"]).toLocaleDateString('th-TH', {
        weekday: 'long',     // แสดงชื่อวัน (จันทร์ อังคาร ...)
        year: 'numeric',     // แสดงปีแบบ 4 หลัก
        month: 'long',       // แสดงชื่อเดือน (กันยายน)
        day: 'numeric'
    })}
    `;
    container.classList.add("lost");
    container.classList.remove("loader");
}

const showNotFound = () => {
    showError();
    container.classList.add("notfound");
    container.classList.remove("loader");
}

const _scorllTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); }

const getParamFromURL = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

const _getLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

const render_form = (data)=>{
    infoArea00.innerHTML = "";
    infoArea01.innerHTML = "";
    infoArea02.innerHTML = "";

    document.getElementById('frm-regist').querySelector("#vehicle-type")
        .addEventListener("change", function (e) {
            let value = this.value;
            let el = document.getElementById('frm-regist');
            //-----
            el.classList.remove("vehicle-type-");
            el.classList.remove("vehicle-type-car");
            el.classList.remove("vehicle-type-bike");
            el.classList.add("vehicle-type-" + value.toLowerCase());
        });

    document.getElementById('frm-regist').getElementsByTagName("form")[0]
        .addEventListener('submit', async function (e) {
            e.preventDefault();

            showError("...กำลังบันทึกรายการ โปรดรอ...");

            document.getElementById('label-no').disabled = false;
            document.getElementById('vehicle-type').disabled = false;

            const form = e.target;
            const formData = new FormData(form);

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

            pushDataRegist(data);

        });


    document.getElementById('label-no').value = data["label-no"] || '';
    //-----
    document.getElementById('vehicle-type').value = data["vehicle-type"] || '';
    document.getElementById('vehicle-type').dispatchEvent(new Event("change"));
    //-----
    document.getElementsByClassName('permit-qr').item(0).value = getParamFromURL("c");
    document.getElementsByClassName('permit-qr').item(1).value = getParamFromURL("c");
  
    //-----
    document.getElementById('vehicle-type').required = true;
    document.getElementById('label-no').required = true;

    let is_enable =  data["label-no"]!="" && data["vehicle-type"]!="" ;

    document.getElementById('label-no').disabled = is_enable;
    document.getElementById('vehicle-type').disabled = is_enable;
    document.getElementById('lp-no-0').required = is_enable;
    document.getElementById('lp-province-0').required = is_enable;
    document.getElementById('owner-unit').required = is_enable;
    document.getElementById('owner-unit').value = data["owner-unit"] || '';
    document.getElementById('owner-name').required = is_enable;
    document.getElementById('owner-name').value = data["owner-name"] || '';
    document.getElementById('owner-phone').required = is_enable;
    document.getElementById('owner-phone').value = data["owner-phone"] || '';

    frmRegist.style.display  = "block";
    container.classList.remove("loader");

}

const render_info = (data,is_private = false) => {

    frmRegist.style.display    = "none";
    cautionArea.style.display  = "none";

    var info_owner = data;
    //-----

    let lang = localStorage.getItem("app:parkqr:pref-lang");


    infoArea01.innerHTML = `
        <h1 data-lang="header01">ข้อมูลผู้ใช้สิทธิ์จอดยานพาหนะ</h1>
        ${renderInfo("รหัสคิวอาร์", info_owner["permit-qr"], "permit-qr")}
        ${renderInfo("ลำดับสติกเกอร์", info_owner["label-no"], "label-no") }
        ${data["vehicles"].length ? "" : renderInfo("ประเภท", info_owner["vehicle-type"] == "BIKE" ? "จักรยานยนต์" : "รถยนต์","vehicle-type")}

        ${renderInfo("อาคาร/โซนจอดฯ", (function (val) { return ({ "BLD_A": "อาคาร A", "BLD_B": "อาคาร B", "BLD_C": "อาคาร C" })[val]; })(info_owner["owner-zone"]),"owner-zone")}
        ${renderInfo("เลขที่ห้องชุด", info_owner["owner-unit"],"owner-unit")}
        ${renderInfo("ชื่อเจ้าของร่วมฯ", info_owner["owner-name"],"owner-name")}
        ${renderInfo("หมายเลขโทรศัพท์", info_owner["owner-phone"], "owner-phone", "", "phone", "a")}

        ${data["is-regist"] ? renderInfo("วันลงทะเบียน", new Date(info_owner["datetime-regist"]).toLocaleDateString(lang, {
            weekday: 'long',     // แสดงชื่อวัน (จันทร์ อังคาร ...)
            year: 'numeric',     // แสดงปีแบบ 4 หลัก
            month: 'long',       // แสดงชื่อเดือน (กันยายน)
            day: 'numeric'       // แสดงวันเป็นตัวเลข
        }),"datetime-regist", "", "") : ""}

        ${data["is-regist"] ? renderInfo("วันหมดอายุ", new Date(info_owner["date-expire"]).toLocaleDateString(lang,{
          weekday: 'long',     // แสดงชื่อวัน (จันทร์ อังคาร ...)
          year: 'numeric',     // แสดงปีแบบ 4 หลัก
          month: 'long',       // แสดงชื่อเดือน (กันยายน)
          day: 'numeric'       // แสดงวันเป็นตัวเลข
        }), "date-expire","", "expired"):""}

        ${renderInfo("หมายเหตุ", info_owner["remark"],"remark")}

        ${(is_private?"":`<button onclick="fetchDataPrivate() data-lang = "btn-detail">รายละเอียดผู้ใช้สิทธิ์ฯเพิ่มเติม</button>`) }
    `;

    infoArea02.innerHTML = "";

    var vItems = "";
    data["vehicles"].forEach(function(r,idx){
        vItems +=  `
        <h2 data-lang = "header-vehicle0${idx + 1}">ยานพาหนะ #${idx + 1} </h2>
        ${renderInfo("ประเภท", r["vehicle-type"] == "BIKE" ? "จักรยานยนต์" : "รถยนต์"
            , "vehicle-type-" + (r["vehicle-type"] == "BIKE" ? "bike" : "car")
            , "vehicle-type-" + (r["vehicle-type"] == "BIKE" ? "bike" : "car") + (idx + 1))}
        ${renderInfo("เลขทะเบียน",  r["lp-no"])}
        ${renderInfo("จังหวัดจดทะเบียน",  r["lp-province"])}
        `;
    });

    infoArea02.innerHTML = vItems!="" ? vItems:"<h2>ไม่พบข้อมูลยานพาหนะที่ลงทะเบียน</h2>";
    cautionArea.style.display = "block";

    showError();

    switchLanguage();

}

const fetchIPAddr = async() =>{
    const response = await fetch("https://api.ipify.org?format=json");
    const res = await response.json();

    return res["ip"]?res["ip"]:undefined;

}

const fetchDataPublic = async(code) => {
    try {
        if (container.classList.contains("loader")) return 0;

        container.classList.remove("lost");

        showError("<h1>... กำลังค้นหา ...</h1>");
        infoArea01.innerHTML = "";
        infoArea02.innerHTML = "";

        container.classList.add("loader");
        //-----
        _scorllTop();

        let ipAddr = await fetchIPAddr();
        //let pos = await _getLocation();

        const response = await fetch(`${URL_API}`,{
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8"},
            body: JSON.stringify({
                "user-agent": navigator.userAgent, "ip-addr": ipAddr,
                "action": "permit-public", "permit-qr": code
            })
        });
        
        const res = await response.json();

        if (!res){  showError("...เกิดข้อผิดพลาดในการดึงข้อมูล..."); return;}
        //-----
        if (res && res.status == "fail") { showNotFound(); return; }
        if (res && res.status == ""){  }
    
        if (!res.data) { showNotFound(); return; }

        if (res.data["is-lost"]) {
            showError("");
            showLost(res.data);
            return 0;
        }
        if (!res.data["is-regist"]) { render_form(res.data); return 0;}

        render_info(res.data);
        container.classList.remove("loader");

    } catch (e) {
        container.classList.remove("loader");
        showError("...เกิดข้อผิดพลาดในการดึงข้อมูล...");
    }
}

const fetchDataPrivate = async(key) =>{
    try {

        if (container.classList.contains("loader")) return 0;

        const qr = getParamFromURL("c");
        //-----
        key = key ? key : prompt("กรุณากรอกรหัสผ่าน:");

        if(key=="" || !key) return 0;
        //-----
        _scorllTop();
        //-----

        infoArea01.innerHTML == "" ? showError("<h1>... กำลังค้นหา ...</h1>") : showError("...กำลังเข้าถึงข้อมูล...");

        container.classList.add("loader");

        let ipAddr = await fetchIPAddr();

        const response = await fetch(`${URL_API}`,{
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ "user-agent":navigator.userAgent,"ip-addr":ipAddr, "action":"permit-private", "permit-qr":qr, "user-key": key })
        });
        const res = await response.json();
        
        if (!res){ showError("...เกิดข้อผิดพลาดในการดึงข้อมูล..."); return;}
        //-----
        if (res && res.status == "fail") { showError("... ไม่อนุญาติให้เข้าถึง/รหัสผ่านผิด ..."); return; }
        if (!res.data) { showNotFound(); return; }
        
        if (!res.data["is-regist"]) { render_form(res.data); return 0; }

        if (res.data["is-lost"]) {
            showError("");
            showLost(res.data);
            return 0;
        }

        showError("");
        render_info(res.data, true);

        !TTLStore.get("key") ? TTLStore.set('key', key, 2 * 60 * 60 * 1000):"";
        

    } catch (e) {
        showError("...เกิดข้อผิดพลาดในการดึงข้อมูล...");
    }
}

const pushDataRegist = async(formData) =>{
    try{

       
        container.classList.add("loader");
        //infoArea01.innerHTML = "...กำลังบันทึกรายการ รอสักครู่...";
        //-----

        _scorllTop();
 
        let data = formData;
        data["action"]      = "permit-regist";
        data["ip-addr"]     = await fetchIPAddr();
        data["user-agent"]  = navigator.userAgent

        const response = await fetch(`${URL_API}`, {
            method: 'POST',
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(data)
        });

        const res = await response.json();

        if (res && res.status == "fail")        { infoArea01.innerHTML = ""; showError("...บันทึกข้อมูลไม่สำเร็จ..."); return; }
        if (res && res.status == "not-found")   { infoArea01.innerHTML = ""; showError(`...${res.message}...`); return; }
        if (res && res.status == "conflict")    { infoArea01.innerHTML = ""; showError(`...${res.message}...`); return; }

        showError("...ลงทะเบียนสำเร็จ...");                 
        
        render_info(res.data,true);
        container.classList.remove("loader");

    }catch(e){
        container.classList.remove("loader");
        showError("...เกิดข้อผิดพลาด กรุณาบันทึกใหม่อีกครั้ง...");
    }
}

const switchLanguage = (lang) => {

    lang = lang ? lang: localStorage.getItem("app:parkqr:pref-lang");

    let elements = document.querySelectorAll("[data-lang]");     
    elements.forEach(el => {
        let key = el.getAttribute('data-lang');
        //-----
        if (key == "") return 0;
        const text = LANGUAGE[lang] && LANGUAGE[lang][key]? LANGUAGE[lang][key]:"";       

        if (text) {
            el.innerHTML = text;                     
        }
    });
}


const code = getParamFromURL("c");


(function () {
    return 0;
    const NS = "app:parkqr:pref-lang";
    //-----
    const toggle = document.getElementById('langToggle');
    const knob   = document.querySelector('.sw-lang-knob .abbr');
    const label  = document.getElementById('langLabel');

    // อ่านค่าจาก localStorage ถ้ามี (เพื่อเก็บการตั้งค่า)
    const saved = localStorage.getItem(NS);

    document.body.classList.forEach(c => {
        if (c.startsWith('lang-')) { document.body.classList.remove(c); }
    });

    //label.textContent = 'Language';

    if (saved === 'en-EN') {
        document.body.classList.add('lang-en');
        toggle.checked = true;
        toggle.setAttribute('aria-checked', 'true');
        //-----
        knob.textContent = 'EN';
        toggle.setAttribute('aria-label', 'Switch to Thai');

    } else {
        document.body.classList.add('lang-th');
        toggle.checked = false;
        toggle.setAttribute('aria-checked', 'false');
        //----
        knob.textContent = 'TH';
        toggle.setAttribute('aria-label', 'Switch to English');
    }

    toggle.addEventListener('change', function (e) {
        const isEn = e.target.checked;

        document.body.classList.forEach(c => {
            if (c.startsWith('lang-')) { document.body.classList.remove(c);}
        });

        if (isEn) {
            document.body.classList.add('lang-en');
            knob.textContent = 'EN';
            //label.textContent = 'Language';
            toggle.setAttribute('aria-checked', 'true');
            toggle.setAttribute('aria-label', 'Switch to Thai');
            //-----
            localStorage.setItem(NS, 'en-EN');
            switchLanguage("en-EN");
        } else {
            document.body.classList.add('lang-th');
            knob.textContent = 'TH';
            //label.textContent = 'ภาษา';
            toggle.setAttribute('aria-checked', 'false');
            toggle.setAttribute('aria-label', 'Switch to English');
            //-----
            localStorage.setItem(NS, 'th-TH');
            switchLanguage('th-TH')
        }
    });

})();



if (code) {
    let key  = TTLStore.get("key") || undefined;
    let lang = TTLStore.get("pref-lang") || "en-EN"
    //----

    //switchLanguage(lang);

    //key ? fetchDataPrivate(key) : fetchDataPublic(code);

} else {
    showError("ไม่พบรหัสคิวอาร์ในเส้นทาง");
}