

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
    const NS = 'app:parkingpermit:'; // กันชนชื่อ key
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

        } catch {   // ข้อมูลพัง—เคลียร์ทิ้ง
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
                if (rec?.expiresAt && now() > rec.expiresAt) {  localStorage.removeItem(k); }
            } catch {
                localStorage.removeItem(k);
            }
        }
    }

    return { set, get, remove, sweep };
})();


const renderInfo = (label, value="", itemClass="" , valueClass = '',type=undefined) => {
    if (value.trim() == "" ) return "";
    //-----                                        
    let display_value = value;
    if(type == "a") display_value = `<a href="tel:${value.replace(/\D/g, '')}">${value}</a>`;

    return `<div class="item ${itemClass}">
            <div class="label">${label}</div>
            <div class="value ${valueClass}">${display_value}</div>
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

    infoArea01.innerHTML = `
        <h1>ข้อมูลผู้ใช้สิทธิ์จอดยานพาหนะ</h1>
        ${renderInfo("รหัสคิวอาร์", info_owner["permit-qr"])}
        ${renderInfo("ลำดับสติกเกอร์", info_owner["label-no"])}
        ${data["vehicles"].length? "": renderInfo("ประเภท", info_owner["vehicle-type"] == "BIKE" ? "จักรยานยนต์" : "รถยนต์")}
        ${renderInfo("เลขที่ห้องชุด", info_owner["owner-unit"])}
        ${renderInfo("ชื่อเจ้าของร่วมฯ", info_owner["owner-name"])}
        ${renderInfo("หมายเลขโทรศัพท์", info_owner["owner-phone"], "", "phone", "a")}
        ${renderInfo("วันลงทะเบียน", new Date(info_owner["datetime-regist"]).toLocaleDateString('th-TH', {
            weekday: 'long',     // แสดงชื่อวัน (จันทร์ อังคาร ...)
            year: 'numeric',     // แสดงปีแบบ 4 หลัก
            month: 'long',       // แสดงชื่อเดือน (กันยายน)
            day: 'numeric'       // แสดงวันเป็นตัวเลข
        }), "", "")}
        ${renderInfo("วันหมดอายุ", new Date(info_owner["date-expire"]).toLocaleDateString('th-TH',{
          weekday: 'long',     // แสดงชื่อวัน (จันทร์ อังคาร ...)
          year: 'numeric',     // แสดงปีแบบ 4 หลัก
          month: 'long',       // แสดงชื่อเดือน (กันยายน)
          day: 'numeric'       // แสดงวันเป็นตัวเลข
        }),"", "expired")}
        ${renderInfo("หมายเหตุ", info_owner["remark"],"remark")}

        ${(is_private?"":`<button onclick="fetchDataPrivate()">รายละเอียดผู้ใช้สิทธิ์ฯเพิ่มเติม</button>`) }
    `;

    infoArea02.innerHTML = "";

    var vItems = "";
    data["vehicles"].forEach(function(r,idx){
        vItems +=  `
        <h2>ยานพาหนะ #${idx + 1} </h2>
        ${renderInfo("ประเภท", r["vehicle-type"] == "BIKE" ? "จักรยานยนต์" : "รถยนต์", "vehicle-type-" + (r["vehicle-type"] == "BIKE" ? "bike" : "car") + (idx + 1))}
        ${renderInfo("เลขทะเบียน",  r["lp-no"])}
        ${renderInfo("จังหวัดจดทะเบียน",  r["lp-province"])}
        `;
    });

    infoArea02.innerHTML = vItems!="" ? vItems:"<h2>ไม่พบข้อมูลยานพาหนะที่ลงทะเบียน</h2>";
    cautionArea.style.display = "block";

    showError();

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


const code = getParamFromURL("c");

if (code) {
    let key = TTLStore.get("key") || undefined;
    //----
    key ? fetchDataPrivate(key) : fetchDataPublic(code);
} else {
    showError("ไม่พบรหัสคิวอาร์ในเส้นทาง");
}