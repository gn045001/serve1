//version: 0.1, date: 20240420, Creater: jiasian.lin
//version: 0.2, date: 20240424, Creater: jiasian.lin

//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report 
//   +-- [tmpDir] temp
//   +-- [logDir] log => CPUSummer.log

//section 1:執行環境的資料夾之環境變數
//執行MongoDB數據庫
const mongoose = require('mongoose'); 
//讀取ComputerStart.json資料
const fs = require('fs');
//寫入至Summerlog
const Summerlog = 'log/CPUSummer.log'

//section 2: 取得時間的變數
//取得時間變數功能
const currentDate = new Date();
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

// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@192.168.50.115:27017/');
//建立DB功能
const db = mongoose.connection;
// docker stats CPU狀態使用率，寫進Summer log日誌
fs.appendFile(Summerlog, '可以開始寫入資料進入mongodb'+ '\n', (err) => {
    if (err) {
        console.error('寫入log日誌有問題', err);
        return;
        }
        console.log('寫入log日誌已成功寫入')
});


//section 2:執行環境的資料夾之環境變數
//當連線有問題時
db.on('error', console.error.bind(console, 'connection error:'));
//如果成功會回復onnected to MongoDB
db.once('open', function() {
    console.log('Connected to MongoDB');
});


//section 3:定義數據的模型並寫入至DB中
// 定義數據模型
const containerDataSchema = new mongoose.Schema({
    timestamp: String,
    container_id: String,
    container_name: String,
    cpu_percentage: String,
});

//數據加入至MongoDB ，資料表CPUstats中
const ContainerData = mongoose.model('CPUstats', containerDataSchema);


//section 4:處理JSON數據
//讀取並處理 JSON 數據
fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', async (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }

    const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
    
    try {
        // 將數據保存到 MongoDB 中
     const result = await ContainerData.insertMany(dictionaries);
	console.log('成功保存數據到 MongoDB：',result);
    } catch (err) {
        console.error('保存數據到 MongoDB 失敗：', err);
    } finally {
        // 關閉數據庫連接
        mongoose.connection.close();
    }

    // docker stats CPU狀態使用率，寫進Summer log日誌
    fs.appendFile(Summerlog, '以確認CPU資料完畢寫入log日誌已成功寫入'+ '\n', (err) => {
        if (err) {
            console.error('寫入log日誌有問題', err);
            return;
            }
            console.log('寫入log日誌已成功寫入')
    }); 
});