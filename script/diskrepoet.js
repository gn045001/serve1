// version: 0.1, date: 20240414, Creator: jiasian.lin
// version: 0.2, date: 20240420, Creator: jiasian.lin

//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report =>${formattedDate}_Diskoutput.html 、 diskreportSummer.log
//   +-- [tmpDir] temp
//   +-- [logDir] log

//引入 ejs 模組，用於在 Node.js 中生成 HTML 模板
const ejs = require('ejs');
// 載入 fs 模組用於讀取檔案
const fs = require('fs');

//寫入至Summerlog
const Summerlog = 'report/diskreportSummer.log'

// Line Notify 存取權杖
const querystring = require('querystring');
const accessToken = 'lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2';
// Line Notify API 端點
const url = 'https://notify-api.line.me/api/notify';

// 設定 HTTP 請求標頭
const config = {
    headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
    }
};
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
//設定時間變數給予開啟檔案的能力  
const currentDateTime = `${year}${month}${day}-${hour}`;

// 輸出Html的資料
const fileName = `report/${formattedDate}_Diskoutput.html`;

//寫進Summer log日誌
fs.appendFile(Summerlog, '產生report-Diskoutput.html'+ '\n', (err) => {
    if (err) {
        console.error('寫入log日誌有問題', err);
        return;
        }
        console.log('寫入log日誌已成功寫入')
});
//section 3: 輸出HTML資料
// 讀取raw的JSON 文件的内容

const filePath = `raw/${currentDateTime}-DiskSpace.json`;

// 檢查檔案是否存在
if (fs.existsSync(filePath)) {
    console.log('檔案存在，執行 echo 檔案存在 ');
    //寫進Summer log日誌
    fs.appendFile(Summerlog, '產生report-Diskoutput.html'+ '\n', (err) => {
        if (err) {
            console.error('寫入log日誌有問題', err);
            return;
            }
            console.log('寫入log日誌已成功寫入')
    });
    fs.readFile(filePath, 'utf8', (err, data)=> {
        if (err) {
            console.error('File exists? Confirm if the file exists at the provided path.', err);
            return;
        }
        const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
        //console.log('解讀數據：', dictionaries);

        // 使用 fs 模組同步讀取 'nodejs/template.ejs' 文件，並將其作為模板字符串儲存到 template 變數中
        const template = fs.readFileSync('nodejs/template.ejs', 'utf8');
        // 使用 ejs 模組中的 render 函數將模板與指定的數據合併生成 HTML 字符串
        const renderedHtml = ejs.render(template, { dictionaries: dictionaries });
        // 將生成的 HTML 字符串輸出到控制台


        // 當按輸出report至小時
        fs.writeFile(fileName, renderedHtml, (err) => {
            if (err) {
                console.error('寫入錯誤', err);
                return;
            }
            console.log('HTML 已成功寫入');
        });
    });


} else {
    console.error('DiskSpace.json檔案不存在，離開程式');
// 發送 POST 請求到 Line Notify API
    const memoryMessagelog = `error`;            
    const memorymessages = querystring.stringify({
        message: memoryMessagelog
    });

    // 發送 POST 請求到 Line Notify API
        axios.post(url,memorymessages, config)
            .then(response => {
            console.log('訊息發送成功:', response.data);
            })
            .catch(error => {
            console.error('訊息發送失敗:', error.response.data);
            });	
}




