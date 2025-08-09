
const infoArea01 = document.getElementById('info-area01');
const infoArea02 = document.getElementById('info-area02');
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

const showError = (msg) => {  infoArea01.innerHTML = `<div class="error">${msg}</div>`; };

const getParamFromURL = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

const render_form = (data)=>{
    infoArea01.innerHTML = "";
    infoArea02.innerHTML = "";

    document.getElementById('label-no').value = data["label-no"] || '';
    document.getElementById('vehicle-type').value = data["vehicle-type"] || '';
    document.getElementById('permit-qr').value = getParamFromURL("c");

    document.getElementById('vehicle-type').required = true;
    document.getElementById('label-no').required = true;

    let is_enable =  data["label-no"]!="" && data["vehicle-type"]!="" ;

    document.getElementById('label-no').disabled = is_enable;
    document.getElementById('vehicle-type').disabled = is_enable;
    document.getElementById('lp-no').required = is_enable;
    document.getElementById('lp-province').required = is_enable;
    document.getElementById('owner-unit').required = is_enable;
    document.getElementById('owner-name').required = is_enable;
    document.getElementById('owner-phone').required = is_enable;

    frmRegist.style.display  = "block";

    document.getElementById('frm-regist').getElementsByTagName("form") [0]
        .addEventListener('submit', async function(e) {
            e.preventDefault();

            infoArea01.innerHTML = "...กำลังบันทึกข้อมูล...";
            document.getElementById('label-no').disabled = false;
            document.getElementById('vehicle-type').disabled = false;
            
            const form = e.target;
            const formData = new FormData(form);
                                        
            const data = Object.fromEntries(formData.entries()); // แปลง FormData เป็น Object
            pushDataRegist(data);


        });
}

const render_info = (data,is_private = false) => {

    frmRegist.style.display  = "none";
    var info_owner = data[0];
    //-----

    infoArea01.innerHTML = `
        <h1>ข้อมูลผู้ใช้สิทธิ์จอดยานพาหนะ</h1>
        ${renderInfo("รหัสคิวอาร์", info_owner["permit-qr"])}
        ${renderInfo("รหัสสติกเกอร์", info_owner["label-no"])}
        ${renderInfo("ห้องชุดเลขที่", info_owner["owner-unit"])}
        ${renderInfo("ชื่อเจ้าของร่วม", info_owner["owner-name"])}
        ${renderInfo("หมายเลขโทรศัพท์", info_owner["owner-phone"],"","phone")}
        ${renderInfo("วันหมดอายุ", new Date(info_owner["date-expire"]).toLocaleDateString('th-TH'), "expired")}
        ${(is_private?"":`<button onclick="fetchDataPrivate()">ดูข้อมูลเพิ่มเติม</button>`) }
    `;

    infoArea02.innerHTML = "";
    var vItems = "";
    data.forEach(function(r,idx){
        vItems +=  `
        <h2>ยานพาหนะ ${idx+1}</h2>
        ${renderInfo("ประเภท", r["vehicle-type"])}
        ${renderInfo("เลขทะเบียน",  r["lp-no"])}
        ${renderInfo("จังหวัด",  r["lp-province"])}
        `;
    });
    infoArea02.innerHTML = vItems;

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
        if (res && res.status == "fail") { showError("ไม่พบข้อมูลสำหรับสติกเกอร์นี้"); return; }
        if (res &&  res.status == ""){  }
    
        if(!res.data.length) {  showError("...รหัสคิวอาร์นี้ไม่มีในระบบ..."); return;}
        if(!res.data[0]["is-regist"]) { render_form(res.data[0]); return 0;}

        render_info(res.data);

    } catch (e) {
        
        showError("...เกิดข้อผิดพลาดในการดึงข้อมูล...");
    }
}

const fetchDataPrivate = async() =>{
    try {
        const key = prompt("กรุณากรอกรหัสผ่าน:");
        const qr  = getParamFromURL("c");

        if(key=="") return 0;
        //-----
        infoArea01.innerHTML = "<h1>... กำลังค้นหา ...</h1>";
        infoArea02.innerHTML = "";

        let ipAddr = await fetchIPAddr();

        const response = await fetch(`${URL_API}`,{
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ "user-agent":navigator.userAgent,"ip-addr":ipAddr, "action":"permit-private", "permit-qr":qr, "user-key": key })
        });
        const res = await response.json();
        
        if (!res){  showError("...เกิดข้อผิดพลาดในการดึงข้อมูล..."); return;}
        //-----
        if (res || res.status == "fail") { showError("ไม่อนุญาติให้เข้าถึงข้อมูล"); return; }

        render_info(res.data,true);

    } catch (e) {
        showError(...เกิดข้อผิดพลาดในการดึงข้อมูล...);
    }
}

const pushDataRegist = async(formData) =>{
    try{
        
        infoArea01.innerHTML = "...บันทึกรายการ รอสักครู่...";
        
        let data = formData;
        data["action"] = "permit-regist";

        const response = await fetch(`${URL_API}`, {
            method: 'POST',
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(data)
        });

        const res = await response.json();

        if (res && res.status == "fail") { showError("บันทึกข้อมูลไม่สำเร็จ"); return; }
        if (res && res.status == "not-found") { showError(res.message); return; }
        if (res && res.status == "conflict") {  showError(res.message); return; }
                                      
        infoArea01.innerHTML = "...บันทึกสำเร็จ...";                    
        
        render_info([res.data],true);


    }catch(e){

        showError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
}


const code = getParamFromURL("c");

if (code) { fetchDataPublic(code); } else { showError("ไม่พบรหัสคิวอาร์ในเส้นทาง"); }