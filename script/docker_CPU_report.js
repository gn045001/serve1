// version: 0.1, date: 20240414, Creator: jiasian.lin
// version: 0.2, date: 20240420, Creator: jiasian.lin
// Adding features for Docker usage
// Alert for checking if the file exists
// version: 0.3, date: 20240427, Creator: jiasian.lin
//判斷是否正常輸出如異常沒執行跳出告警
//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report =>${formattedDate}_CPUMessagelog.html 、 diskreportSummer.log
//   +-- [tmpDir] temp
//   +-- [logDir] log


//小作品用處 監控docker 確認 docker 狀態 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置
//GitHub


//Dokcer Hub

//我的小作品相關設定
//Docker configuration in crontab -e
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已




//section 1: 環境變數
//引入 ejs 模組，用於在 Node.js 中生成 HTML 模板
const ejs = require('ejs');
// 載入 fs 模組用於讀取檔案
const fs = require('fs');
//寫入至Summerlog
const Summerlog = 'log/diskCPUSummer.log'


//section 2: 取得時間的變數
//取得時間變數功能
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 13).replace(/[-T:]/g, '');
//讀取年份變數功能
const year = currentDate.getFullYear();
// 讀取月份變數功能並設定為兩位數
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 

// 讀取日期變數功能並設定為兩位數
const day = String(currentDate.getDate()).padStart(2, '0'); 
// 讀取小時變數功能並設定為兩位數
const hour = String(currentDate.getHours()).padStart(2, '0');
//設定規劃的時間變數  
const currentDateTime = `${year}${month}${day}-${hour}`;


//輸出Html的資料
const fileName = `report/${formattedDate}_CPU_report.html`;

    // Line Notify 功能
    const querystring = require('querystring');
    // Line Notify 存取權杖
    const accessToken = 'lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2';
    // Line Notify API 端點
    const axios = require('axios');
    const url = 'https://notify-api.line.me/api/notify';

    // 設定  Notify 的功能
    const config = {
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    };



//section 3: 輸出HTML資料
// 讀取raw的JSON 文件的内容
const filePath = `raw/${currentDateTime}-DiskSpace.json`;

if (fs.existsSync(filePath)) {
    
    //寫進Summer log日誌
    fs.appendFile(Summerlog, '開始整理資料'+ '\n', (err) => {
        if (err) {
            //寫至Summerlog中說明有問題還
            console.error('無法開始整理', err);
            return;
            }
            //寫至Summerlog中說明沒有問題
            console.log('開始整理diskreport資料')
        });
        console.log('DiskSpace.json檔案存在，執行確認檔案存在');
        //寫進Summer log日誌
    fs.appendFile(Summerlog, '${currentDateTime}-DiskSpace.json檔案存在'+ '\n', (err) => {
        if (err) {
            console.error('${currentDateTime}-DiskSpace.json檔案存在但是寫入有問題', err);
            return;
            }
            console.log('${currentDateTime}-DiskSpace.json檔案存在寫入沒問題')
        });



    fs.readFile(filePath, 'utf8', (err, data) => {
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


}else{
    console.log('report/CPUMessagelog.html 寫入失敗');
    console.error('DiskSpace.json檔案不存在CPUMessagelog失敗，離開程式');
// 發送 POST 請求到 Line Notify API
    const CPUMessagelog = `error DiskSpace.json 檔案不見須注意`;            
    const CPUMessages = querystring.stringify({
        message: CPUMessagelog
    });
    // 發送 POST 請求到 Line Notify API
    axios.post(url,CPUMessages, config)
        .then(response => {
        console.log('因為DiskSpace.json資料缺少發送訊息Line發送訊息:', response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })
        .catch(error => {
        console.error('error DiskSpace.json 檔案不見須注意:', error.response.data);
        fs.appendFile(Summerlog, '訊息發送失敗'+ '\n', (err) => {
        if (err) {
            console.error('error DiskSpace.json 檔案不見須注意寫輸入Summerlog成功', err);
            return;
            }
            console.log('error DiskSpace.json 檔案不見須注意且寫輸入Summerlog失敗')
            });
        });  
}