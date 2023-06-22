const constDVCURL =
  "https://dvc.vst.mof.gov.vn/tttk-frontend/dvc-dcsd/them-moi";
const defaultValue_CTMT_AD = "00000";
let lastUrl = location.href;

//--------Theo dõi trạng thái Url để Create/Remove Element Button-------
window.addEventListener("load", (event) => {
  onUrlChange();
});

new MutationObserver(() => {
  const url = location.href;
  if (url != lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, { subtree: true, childList: true });

const onUrlChange = () => {
  if (location.href.startsWith(constDVCURL)) {
    console.log("Create button");
    createButton();
  } else {
    console.log("Remove button");
    removeButton();
  }
};

// --------Create & Remove Element----------
const createButton = () => {
  const htmlButton = `
    <button class="btn_LoadData" id="btn_load_extension" style="z-index: 999999;position:fixed;right: 0%;top: 2%;cursor: pointer;background: #ff9800;color: #fff;border: unset;padding: 2px 5px;border-top-left-radius: 10px;border-bottom-left-radius: 10px;">
      <img src="https://vcsvietnam.com/images/logo-VCS-Viet-Nam.svg" width="50"/>
      Tải dữ liệu tự động
    </button>
  `;
  document.querySelector("body").insertAdjacentHTML("beforeend", htmlButton);
  const selectFileBtn = document.getElementById("btn_load_extension");
  selectFileBtn.addEventListener("click", selectFile);
};

const removeButton = () => {
  const button = document.getElementById("btn_load_extension");
  if (button) {
    button.remove();
  }
};

//--------Select file - Onclick button--------
const selectFile = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx"; // chỉ chấp nhận các định dạng tập tin .xlsx
  input.onchange = (event) => {
    var result = [];
    const file = event.target.files[0];
    console.log("Selected file:", file);
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (event) => {
      var data = new Uint8Array(event.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      workbook.SheetNames.forEach((sheetName) => {
        var worksheet = workbook.Sheets[sheetName];
        var sheetJSON = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          blankrows: false,
          defval: "",
        });
        const formattedJSON = formatSheetJSON(sheetJSON);
        result.push(formattedJSON);
      });
      validateFormFile(result);
      console.log("Dữ liệu là:",result);
    };
  };
  input.click();
};

//------Fill dữ liệu vào Html Table-----------
const fillDataWeb = (arrayJson) => {
  const data = formatValueJson(arrayJson);
  const maTemplate = checkIDTemplate();
    fillDataGeneralInfo(data, maTemplate); //Fill dữ liệu thông tin chung
    const tbody = document.querySelector("tbody.ng-pristine");
    if (data) {
      let id = 0;
      let cellCount = maTemplate == "01a" ? 15 : 12;
      let dataFill = maTemplate == "01a" ? data[0] : data[1];
      addNewEmptyRows(dataFill.length - 11);
      for (let i = 11; i < dataFill.length; i++) {
        const row = tbody.querySelector(`tr:nth-child(${(id += 1)})`);
        for (let j = 1; j < cellCount; j++) {
          const input = row.querySelector(`td:nth-child(${j + 1}) input`);
          if (!input.disabled && !input.readonly && dataFill[i][`cell_${j}`]) {
            input.value = dataFill[i][`cell_${j}`];
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
      }
    }
};

//------Fill dữ liệu thông tin chung----------
const fillDataGeneralInfo = (data, maTemplate) => {
  var ipMaChuong = document.querySelector('input[formcontrolname="maChuong"]');
  var slMaNS = document.querySelector('select[formcontrolname="maCapNs"]');
  var slLoaiDuToan = document.querySelector('select[formcontrolname="loaiDuToan"]');
  var slLoaiDC = document.querySelector('select[formcontrolname="loaiDc"]');
  var slQuyDC = document.querySelector('select[formcontrolname="quyDoiChieu"]');
  let slNamDC = document.querySelector('select[formcontrolname="namDoiChieu"]');
  let changeEvent = new Event("change");
  let inputEvent = new Event("input");

  //Phần thông tin chung template 01a
  if (maTemplate == "01a") {
    ipMaChuong.value = data[0][0].cell_1;
    ipMaChuong.dispatchEvent(inputEvent);
    if (data[0][5].cell_7) {
      let partsTQ = data[0][5].cell_7.split(" ");
      let thang_or_quy = partsTQ[0];
      console.log("Tháng hoặc quý", thang_or_quy);
      if (thang_or_quy == "Quý") {
        slLoaiDC.value = 2;
        slLoaiDC.dispatchEvent(changeEvent);
        slLoaiDC.disabled = true;
        let optionsQuyDC = slQuyDC.options;
        for (let i = 0; i < optionsQuyDC.length; i++) {
          if (optionsQuyDC[i].textContent == data[0][5].cell_7) {
            var selectedOptionQuyDC = optionsQuyDC[i];
            selectedOptionQuyDC.selected = true;
            break;
          }
        }
        selectedOptionQuyDC ? (slQuyDC.value = selectedOptionQuyDC.value) : slQuyDC.selectedIndex = 0;
        slQuyDC.dispatchEvent(changeEvent);
        slQuyDC.disabled = true;
      }
      if (thang_or_quy == "Tháng") {
        slLoaiDC.value = 1;
        slLoaiDC.dispatchEvent(changeEvent);
        slLoaiDC.disabled = true;
        var slTuThang = document.querySelector('select[formcontrolname="tuThang"]');
        var slDenThang = document.querySelector('select[formcontrolname="denThang"]');
        slTuThang.value = partsTQ[1];
        slTuThang.dispatchEvent(changeEvent);
        slTuThang.disabled = true;
        slDenThang.value = partsTQ[1];
        slDenThang.dispatchEvent(changeEvent);
        slDenThang.disabled = true;
      }
    } else if(!data[0][5].cell_7){
      slLoaiDC.value = 2;
      slLoaiDC.dispatchEvent(changeEvent);
      slLoaiDC.disabled = true;
      slQuyDC.selectedIndex = 0;
      slQuyDC.dispatchEvent(changeEvent);
      slQuyDC.disabled = true;
    }
    let partsNamDC = data[0][5].cell_8.split(" ");
    slNamDC.value = partsNamDC[1];
    slNamDC.dispatchEvent(changeEvent);
    slNamDC.disabled = true;

    // data[0][3].cell_1 == "3"
    //   ? (slMaNS.value = "1: 3")
    //   : (slMaNS.value = "2: 0");
    let optionsMaNS = slMaNS.options;
    for (let i = 0; i < optionsMaNS.length; i++) {
      if (optionsMaNS[i].textContent == data[0][3].cell_1) {
        var selectedOptionMaNS = optionsMaNS[i];
        selectedOptionMaNS.selected = true;
        break;
      }
    }
    selectedOptionMaNS ? (slMaNS.value = selectedOptionMaNS.value) : slMaNS.selectedIndex = 0;
    slMaNS.dispatchEvent(changeEvent);
    slMaNS.disabled = true;

    data[0][6].cell_8 == "Dự toán chính thức"
      ? (slLoaiDuToan.value = "0")
      : (slMaNS.value = "1");
    slLoaiDuToan.dispatchEvent(changeEvent);
    slLoaiDuToan.disabled = true;

    setInterval(()=>{
      slQuyDC && (slQuyDC.disabled = false);
      slLoaiDuToan.disabled = false;
      slMaNS.disabled = false;
      slNamDC.disabled = false;
      slTuThang && (slTuThang.disabled = false);
      slDenThang && (slDenThang.disabled = false);
      slLoaiDC.disabled = false;
    },1000)
  }

  //Phần thông tin chung template 02a
  if (maTemplate == "02a") {
    ipMaChuong.value = data[1][0].cell_1;
    ipMaChuong.dispatchEvent(inputEvent);

    if (data[1][5].cell_5) {
      let partsTQ = data[1][5].cell_5.split(" ");
      let thang_or_quy = partsTQ[0];
      console.log("Tháng hoặc quý", thang_or_quy);
      if (thang_or_quy == "Quý") {
        slLoaiDC.value = 2;
        slLoaiDC.dispatchEvent(changeEvent);
        slLoaiDC.disabled = true;
        let optionsQuyDC = slQuyDC.options;
        for (let i = 0; i < optionsQuyDC.length; i++) {
          if (optionsQuyDC[i].textContent == data[1][5].cell_5) {
            var selectedOption = optionsQuyDC[i];
            selectedOption.selected = true;
            break;
          }
        }
        selectedOption && (slQuyDC.value = selectedOption.value);
        slQuyDC.dispatchEvent(changeEvent);
        slQuyDC.disabled = true;
      }
      if (thang_or_quy == "Tháng") {
        slLoaiDC.value = 1;
        slLoaiDC.dispatchEvent(changeEvent);
        slLoaiDC.disabled = true;
        var slTuThang = document.querySelector('select[formcontrolname="tuThang"]');
        var slDenThang = document.querySelector('select[formcontrolname="denThang"]');
        slTuThang.value = partsTQ[1];
        slTuThang.dispatchEvent(changeEvent);
        slTuThang.disabled = true;
        slDenThang.value = partsTQ[1];
        slDenThang.dispatchEvent(changeEvent);
        slDenThang.disabled = true;
      }
    } else if(!data[1][5].cell_5){
      slLoaiDC.value = 2;
      slLoaiDC.dispatchEvent(changeEvent);
      slLoaiDC.disabled = true;
      slQuyDC.selectedIndex = 0;
      slQuyDC.dispatchEvent(changeEvent);
      slQuyDC.disabled = true;
    }

    // data[1][3].cell_1 == "3"
    //   ? (slMaNS.value = "1: 3")
    //   : (slMaNS.value = "2: 0");
    let optionsMaNS = slMaNS.options;
    for (let i = 0; i < optionsMaNS.length; i++) {
      if (optionsMaNS[i].textContent == data[1][3].cell_1) {
        var selectedOptionMaNS = optionsMaNS[i];
        selectedOptionMaNS.selected = true;
        break;
      }
    }
      selectedOptionMaNS ? (slMaNS.value = selectedOptionMaNS.value) : slMaNS.selectedIndex = 0;
      slMaNS.dispatchEvent(changeEvent);
      slMaNS.disabled = true;

    data[1][6].cell_6 == "Dự toán chính thức" && (slLoaiDuToan.value = "0");
    data[1][6].cell_6 == "Dự toán ứng trước" && (slLoaiDuToan.value = "1");
    slLoaiDuToan.dispatchEvent(changeEvent);
    slLoaiDuToan.disabled = true;

    let partsNamDC = data[1][5].cell_6.split(" ");
    slNamDC.value = partsNamDC[1];
    slNamDC.dispatchEvent(changeEvent);
    slNamDC.disabled = true;
    setInterval(()=>{
      slQuyDC && (slQuyDC.disabled = false);
      slLoaiDuToan.disabled = false;
      slMaNS.disabled = false;
      slNamDC.disabled = false;
      slTuThang && (slTuThang.disabled = false);
      slDenThang && (slDenThang.disabled = false);
      slLoaiDC.disabled = false;
    },1000);
  }
};

//------Format tên các cell của Json----------
const formatSheetJSON = (sheetJSON) => {
  const formattedJSON = sheetJSON.map((row) => {
    const formattedRow = {};
    let propIndex = 0;
    for (let prop in row) {
      const formattedProp = `cell_${propIndex}`;
      formattedRow[formattedProp] = row[prop];
      propIndex++;
    }
    return formattedRow;
  });
  return formattedJSON;
};

//------Format value các cell trống------------
const formatValueJson = (array) => {
  let data = array;
  for (let i = 11; i < data[0].length; i++) {
    !data[0][i].cell_3
      ? (data[0][i].cell_3 = defaultValue_CTMT_AD)
      : data[0][i].cell_3;
  }
  for (let i = 11; i < data[1].length; i++) {
    !data[1][i].cell_5
      ? (data[1][i].cell_5 = defaultValue_CTMT_AD)
      : data[1][i].cell_5;
  }
  return data;
};

//------Thêm hàng trống trong html table------
const addNewEmptyRows = (lengthArray) => {
  // click add rows
  let addRowObject = document.querySelector(
    "tbody.ng-pristine tr:nth-last-child(2) a"
  );
  for (let i = 1; i < lengthArray; i++) if (addRowObject) addRowObject.click();
};

//------Check mã của mẫu đối chiếu-----------
const checkIDTemplate = () => {
  const textTitle = document.querySelector("form div.row span.title");
  if(textTitle){
  let textContent = textTitle.textContent;
  let maTemplate = textContent.split("-")[0];
  return maTemplate;
  } else return false;
};

//-------Check định dạng file, đã fill data chưa----------
const validateFormFile = (data) =>{
  const maTemplate = checkIDTemplate();
  if (maTemplate == "01a" || maTemplate == "02a") {
    var inputCheck;
    maTemplate == "01a" ? (inputCheck=document.querySelector('input[formcontrolname="maCtmtDa"]')) 
                        : (inputCheck=document.querySelector('input[formcontrolname="maCtmtDaNsnn"]'))
    console.log("input:",inputCheck);
    console.log("input check:",typeof inputCheck.value);
    if(data.length < 2){
      alert('Bạn chưa chọn đúng file .xlsx xuất ra từ phần mềm kết toán VCS!');
    } else if(data.length==2){
      if(data[0][0].cell_0 != "Mã chương:" 
      ||data[0][1].cell_0 != "Đơn vị:"
      ||data[0][2].cell_0 != "Mã ĐVQHNS:"
      ||data[0][3].cell_0 != "Mã cấp NS:"
      ||data[1][0].cell_0 != "Mã chương:" 
      ||data[1][1].cell_0 != "Đơn vị:"
      ||data[1][2].cell_0 != "Mã ĐVQHNS:"
      ||data[1][3].cell_0 != "Mã cấp NS:"){
        alert("Đây không phải file xuất từ phần mềm kế toán VCS!")
      } else if(!inputCheck.value){
        fillDataWeb(data);
      } else alert("Dữ liệu đã được thêm! Thêm mẫu mới để tải file lên!")
    }
  }else if(!maTemplate) alert("Bạn chưa mở mẫu để tải dữ liệu lên!")
   else if(maTemplate != "01a" && maTemplate != "02a"){
    alert("Phần mềm chỉ hỗ trợ 2 mẫu đối chiếu: 01a-SDKP/ĐVDT và 02a-SDKP/ĐVDT. Hãy chọn lại mẫu đối chiếu!")
  }
}
