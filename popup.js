// const inputFile = document.getElementById("excel_file");
// const container_fill = document.getElementById("container_fill");
// const type = '02a';
// var result = [];

// // Thêm sự kiện onchange để đọc tệp khi người dùng chọn tệp
// inputFile.addEventListener("change", (event) => {
//   // Lấy tệp đã chọn
//   var file = event.target.files[0];
//   var reader = new FileReader();
//   reader.readAsArrayBuffer(file);
//   reader.onload = (event) => {
//     var data = new Uint8Array(event.target.result);
//     var workbook = XLSX.read(data, { type: "array" });
//     workbook.SheetNames.forEach((sheetName) => {
//       var worksheet = workbook.Sheets[sheetName];
//       var sheetJSON = XLSX.utils.sheet_to_json(worksheet,{ defval: "" });
//       const formattedJSON = formatSheetJSON(sheetJSON);
//       result.push(formattedJSON);
//       createTbodyHtml_02a(result);
//     });
//   };
//   console.log('Dữ liệu là:',result);
//   type == '01a' ? createTbodyHtml_01a(result) : createTbodyHtml_02a(result);
// });

// const createTbodyHtml_01a = (data) => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     // Thêm button vào trang
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tabs[0].id },
//         function: (data) => {
//           console.log("popup",data);
//           var ipMaChuong = document.getElementById('MaChuong');
//           var ipMaNS = document.getElementById('ma_cap_ns');
//           ipMaChuong.value = data[0][1].cell_1;
//           ipMaNS.value = data[0][2].cell_1;
//           // Tìm phần tử tbody của bảng trên trang web
//           const tbody = document.querySelector("tbody");
//           console.log("Data 01a", data);
//           if (data) {
//             // Tạo nội dung HTML cho các hàng của bảng
//             let html = "";
//             for (let i = 9; i < data[0].length; i++) {
//               var obj = data[0][i];
//               html += "<tr>";
//               for (let j = 0; j<15; j++){
//                   // html += `<td>${obj[`cell_${j}`]}</td>`;
//                   html += `<td><input value="${obj[`cell_${j}`]}" ${j==8 ? 'disabled' : ''} ${j==14 ? 'disabled' : ''} class="form-control" placeholder="0"/></td>`;
//               }
//                 html+= "<td><a href='#delete' class='btn btn-danger'>Xoá</a></td>"
//                 html += "</tr>";
//           }

//             // Đặt nội dung HTML cho tbody của bảng
//             tbody.innerHTML = html;
//           }
//         },
//         args: [data],
//       },
//       () => {
//         if (chrome.runtime.lastError) {  
//           console.error(chrome.runtime.lastError);
//         }
//       }
//     );
//   });
// };

// const createTbodyHtml_02a = (data) => {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     // Thêm button vào trang
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tabs[0].id },
//         function: (data) => {
//           var ipMaChuong = document.getElementById('MaChuong');
//           var ipMaNS = document.getElementById('ma_cap_ns');
//           ipMaChuong.value = data[0][1].cell_1;
//           ipMaNS.value = data[0][2].cell_1;
//           // Tìm phần tử tbody của bảng trên trang web
//           const tbody = document.querySelector("tbody");
//           console.log("Data 02a", data);
//           if (data) {
//             // Tạo nội dung HTML cho các hàng của bảng
//             let html = "";
//             for (let i = 9; i < data[0].length; i++) {
//               var obj = data[0][i];
//               html += "<tr>";
//               for (let j = 0; j<12; j++){
//                   // html += `<td>${obj[`cell_${j}`]}</td>`;
//                   html += `<td><input value="${obj[`cell_${j}`]}" ${j==10 ? 'disabled' : ''} ${j==11 ? 'disabled' : ''} class="form-control" placeholder="0"/></td>`;
//               }
//                 html+= "<td><a href='#delete' class='btn btn-danger'>Xoá</a></td>"
//                 html += "</tr>";
//           }

//             // Đặt nội dung HTML cho tbody của bảng
//             tbody.innerHTML = html;
//           }
//         },
//         args: [data],
//       },
//       () => {
//         if (chrome.runtime.lastError) {  
//           console.error(chrome.runtime.lastError);
//         }
//       }
//     );
//   });
// };

// const formatSheetJSON = (sheetJSON) => {
//   const formattedJSON = sheetJSON.map((row) => {
//     const formattedRow = {};
//     let propIndex = 0; // Biến đếm số lần lặp qua các thuộc tính

//     for (let prop in row) {
//       const formattedProp = `cell_${propIndex}`;
//       formattedRow[formattedProp] = row[prop];
//       propIndex++;
//     }

//     return formattedRow;
//   });

//   return formattedJSON;
// }