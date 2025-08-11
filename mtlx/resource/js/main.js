
const infoArea00 = document.getElementById('info-area00');
const infoArea01 = document.getElementById('info-area01');
const infoArea02 = document.getElementById('info-area02');
const cautionArea = document.getElementById('caution-area');
const container  = document.getElementById('container');
const frmRegist  = document.getElementById('frm-regist');

const URL_API = "https://script.google.com/macros/s/AKfycbyVtPa9o1sbeRkbBjiU4HNP98h9RvO8nsDRouD8l87Qz851en8isAlxSiyv7NvwwiHGBA/exec?channel=web";


const renderInfo = (label, value, specialClass = '',type=undefined) => {
    if (value == undefined ) return "";

    let display_value = value;
    if(type == "phone") display_value = `<a href="tel:${value.replace(/\D/g, '')}">${value}</a>`;

    return `<div class="item">
            <div class="label">${label}</div>
            <div class="value ${specialClass}">${display_value}</div>
            </div>`;
};

const showError = (msg) => {  infoArea00.innerHTML = `<div class="error">${msg}</div>`; };

const getParamFromURL = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

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

            infoArea01.innerHTML = "...กำลังบันทึกข้อมูล...";
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
    document.getElementById('permit-qr').value = getParamFromURL("c");
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
        ${renderInfo("เลขที่ห้องชุด", info_owner["owner-unit"])}
        ${renderInfo("ชื่อเจ้าของร่วมฯ", info_owner["owner-name"])}
        ${renderInfo("หมายเลขโทรศัพท์", info_owner["owner-phone"],"","phone")}
        ${renderInfo("วันหมดอายุ", new Date(info_owner["date-expire"]).toLocaleDateString('th-TH',{
          weekday: 'long',     // แสดงชื่อวัน (จันทร์ อังคาร ...)
          year: 'numeric',     // แสดงปีแบบ 4 หลัก
          month: 'long',       // แสดงชื่อเดือน (กันยายน)
          day: 'numeric'       // แสดงวันเป็นตัวเลข
        }), "expired")}
        ${(is_private?"":`<button onclick="fetchDataPrivate()">ดูข้อมูลเพิ่มเติม</button>`) }
    `;

    infoArea02.innerHTML = "";

    var vItems = "";
    data["vehicles"].forEach(function(r,idx){
        vItems +=  `
        <h2>ยานพาหนะ #${idx + 1} </h2>
        ${renderInfo("ประเภท", r["vehicle-type"] == "BIKE"?"จักรยานยนต์":"รถยนต์")}
        ${renderInfo("เลขทะเบียน",  r["lp-no"])}
        ${renderInfo("จังหวัดจดทะเบียน",  r["lp-province"])}
        `;
    });

    infoArea02.innerHTML = vItems!="" ? vItems:"<h2>ไม่พบข้อมูลยานพาหนะที่ลงทะเบียน</h2>";
    cautionArea.style.display  = "block";

}

const fetchIPAddr = async() =>{
    const response = await fetch("https://api.ipify.org?format=json");
    const res = await response.json();

    return res["ip"]?res["ip"]:undefined;

}

const fetchDataPublic = async(code) => {
    try {
        infoArea01.innerHTML = "<h1>... กำลังค้นหา ...</h1>";
        infoArea02.innerHTML = "";

        container.classList.add("loader");
        //-----
        let ipAddr = await fetchIPAddr();

        const response = await fetch(`${URL_API}`,{
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8"},
            body: JSON.stringify({ "user-agent":navigator.userAgent, "ip-addr": ipAddr, "action":"permit-public", "permit-qr":code })
        });
        
        const res = await response.json();

        if (!res){  showError("...เกิดข้อผิดพลาดในการดึงข้อมูล..."); return;}
        //-----
        if (res && res.status == "fail") { showError("ไม่พบข้อมูลสำหรับสติกเกอร์นี้"); infoArea01.innerHTML = ""; return; }
        if (res &&  res.status == ""){  }
    
        if(!res.data) {  showError("...รหัสคิวอาร์นี้ไม่มีในระบบ..."); return;}
        if(!res.data["is-regist"]) { render_form(res.data); return 0;}

        render_info(res.data);
        container.classList.remove("loader");
    } catch (e) {
        container.classList.remove("loader");
        showError("...เกิดข้อผิดพลาดในการดึงข้อมูล...");
    }
}

const fetchDataPrivate = async() =>{
    try {
        const key = prompt("กรุณากรอกรหัสผ่าน:");
        const qr  = getParamFromURL("c");

        container.classList.add("loader");

        if(key=="" || !key) return 0;
        //-----
        showError("...กำลังเข้าถึงข้อมูลส่วนบุคคล...");
        //infoArea01.innerHTML = "<h1>... กำลังค้นหา ...</h1>";
        //infoArea02.innerHTML = "";

        let ipAddr = await fetchIPAddr();

        const response = await fetch(`${URL_API}`,{
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ "user-agent":navigator.userAgent,"ip-addr":ipAddr, "action":"permit-private", "permit-qr":qr, "user-key": key })
        });
        const res = await response.json();
        
        if (!res){ showError("...เกิดข้อผิดพลาดในการดึงข้อมูล..."); return;}
        //-----
        if (res && res.status == "fail") { showError("..ไม่อนุญาติให้เข้าถึงข้อมูล.."); return; }
        
        showError("");
        render_info(res.data,true);
        container.classList.remove("loader");
    } catch (e) {
        container.classList.remove("loader");
        showError("...เกิดข้อผิดพลาดในการดึงข้อมูล...");
    }
}

const pushDataRegist = async(formData) =>{
    try{

        container.classList.add("loader");

        window.scrollTo({ top: 0, behavior: 'smooth'});

        showError("");
            
        infoArea01.innerHTML = "...กำลังบันทึกรายการ รอสักครู่...";

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

        if (res && res.status == "fail")        { infoArea01.innerHTML = ""; showError("บันทึกข้อมูลไม่สำเร็จ"); return; }
        if (res && res.status == "not-found")   { infoArea01.innerHTML = ""; showError(res.message); return; }
        if (res && res.status == "conflict")    { infoArea01.innerHTML = ""; showError(res.message); return; }
                                      
        infoArea01.innerHTML = "...บันทึกสำเร็จ...";                    
        
        render_info(res.data,true);
        container.classList.remove("loader");

    }catch(e){
        container.classList.remove("loader");
        showError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
}


const code = getParamFromURL("c");

if (code) { fetchDataPublic(code); } else { showError("ไม่พบรหัสคิวอาร์ในเส้นทาง"); }