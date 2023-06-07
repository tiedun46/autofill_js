const inputFile = document.getElementById("excel_file");
const rowFill = document.getElementById("countRowFill");
const type = document.getElementById("typeFill");
const button = document.querySelector("#btn_fill_data");
var result = [];

// Thêm sự kiện onchange để đọc tệp khi người dùng chọn tệp
inputFile.addEventListener("change", (event) => {
  // Lấy tệp đã chọn
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = (event) => {
    var data = new Uint8Array(event.target.result);
    var workbook = XLSX.read(data, { type: "array" });
    workbook.SheetNames.forEach((sheetName) => {
      var worksheet = workbook.Sheets[sheetName];
      var sheetJSON = XLSX.utils.sheet_to_json(worksheet);
      result.push(sheetJSON);
    });
  };
  reader.readAsArrayBuffer(file);
});

button.onclick = () => {
  if (!inputFile.value || !rowFill.value) {
    alert("Các trường không được để trống. Vui lòng chọn file và thử lại!");
  } else {
    createHtml();
  }
};

const createHtml = (data) =>{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Thêm button vào trang
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: () => {
                // Tìm phần tử tbody của bảng trên trang web
                const tbody = document.querySelector('tbody');
                console.log('element',tbody);
                console.log('data',result);
                // if (data) {
                //     // Tạo nội dung HTML cho các hàng của bảng
                //     let html = '';
                //     for (let i = 0; i < data[0].length; i++) {
                //       var obj = data[0][i];
                //       html += '<tr>';
                //         html += `<td>${obj.STT}</td>`;
                //         html += `<td>${obj["Họ tên"]}</td>`;
                //         html += `<td>${obj["Giới tính"]}</td>`;
                //         html += `<td>${obj["Ngày sinh"]}</td>`;
                //       html += '</tr>';
                //     }
                
                //     // Đặt nội dung HTML cho tbody của bảng
                //     console.log(html);
                //     tbody.innerHTML = html;
                //     // return html;
                //   }
            },
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          }
        );
      });
 }