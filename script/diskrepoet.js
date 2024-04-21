// version: 0.1, date: 20240414, Creator: jiasian.lin
// version: 0.2, date: 20240420, Creator: jiasian.lin
//引入 ejs 模組，用於在 Node.js 中生成 HTML 模板
const ejs = require('ejs');
// 載入 fs 模組用於讀取檔案
const fs = require('fs');
// 獲取時間
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

// 輸出Html的資料
const fileName = `report/${formattedDate}_Diskoutput.html`;

// 讀取raw的JSON 文件的内容
fs.readFile(`raw/${currentDateTime}-DiskSpace.json`, 'utf8', (err, data)=> {
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

