// version: 0.1, date: 20240414, Creator: jiasian.lin
// version: 0.2, date: 20240420, Creator: jiasian.lin

//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report =>${formattedDate}_CPU_report.html 、 diskreportSummer.log
//   +-- [tmpDir] temp
//   +-- [logDir] log
//引入 ejs 模組，用於在 Node.js 中生成 HTML 模板
const ejs = require('ejs');
// 載入 fs 模組用於讀取檔案
const fs = require('fs');
//寫入至Summerlog
const Summerlog = 'log/diskCPUSummer.log'
// 獲取時間到小時
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 13).replace(/[-T:]/g, '');
const year = currentDate.getFullYear();

// 讀取月份並設定為兩位數
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 

// 讀取日期並設定為兩位數
const day = String(currentDate.getDate()).padStart(2, '0'); 

// 讀取小時並設定為兩位數
const hour = String(currentDate.getHours()).padStart(2, '0'); 
const currentDateTime = `${year}${month}${day}-${hour}`;

//輸出Html的資料
const fileName = `report/${formattedDate}_CPU_report.html`;

//寫進Summer log日誌
fs.appendFile(Summerlog, '產生CPU_report.html'+ '\n', (err) => {
    if (err) {
        console.error('寫入log日誌有問題', err);
        return;
        }
        console.log('寫入log日誌已成功寫入')
});
//section 2: 輸出HTML資料
// 讀取raw的JSON 文件的内容
fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }
    const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
    //console.log('解讀數據：', dictionaries);
    
    // 生成 HTML
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Container Stats</title>
        <style>
            .center {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                flex-direction: column;
            }

            #Table th, #displayTable th, #CPUTable th, #memoryTable th {
            background-color: rgba(230, 13, 67, 0.493);
                text-align: center;  /*將文字置中 */
                padding: 5px; /* 調整框框大小 */
            } 

            #Table td, #displayTable td,
            #CPUTable td, #memoryTable td {
                text-align: center; /* 將文字置中 */
                padding: 10px; /* 調整框框大小 */
            }
            
            #displayTable, #CPUTable, #memoryTable {
                width: 30%; /* 調整表格寬度 */
            }
        </style>
    </head>
    <body>
        <div class="center">
        <h1>Container Execution CPU 大於 50%須注意 </h1>
        <table id="CPUTable" border="1">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Container Name</th>
                    <th>CPU Percentage %</th>
                </tr>
            </thead>
            <tbody>
                <% dictionaries.forEach(container => { %>
                    <% if (parseFloat(container.cpu_percentage) > 50) { %>
                        <tr>
                            <td><%= container.timestamp %></td>
                            <td><%= container.container_name %></td>
                            <td><%= container.cpu_percentage %></td>
                        </tr>
                    <% } %>
                <% }) %>        
            </tbody>
        </table>      
        </div>
    </body>
    </html>
    `;
    // 使用 ejs 模組的 render 函數將模板(template)與數據({ dictionaries: dictionaries })合併生成 HTML 字符串
    const renderedHtml = ejs.render(template, { dictionaries: dictionaries });
    // 將生成的 HTML 字符串輸出到控制台
    //console.log(renderedHtml);

    // 當按輸出report至小時
    fs.writeFile(fileName, renderedHtml, (err) => {
        if (err) {
            console.error('寫入錯誤', err);
            return;
        }
        console.log('HTML 已成功寫入');
    });
});

