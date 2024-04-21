// 引入 mongoose，用於 MongoDB 數據庫操作
const mongoose = require('mongoose'); 
// 讀取檔案
const fs = require('fs');

// 獲取時間
const currentDate = new Date();
const year = currentDate.getFullYear();
// 讀取月份並設定為兩位數
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 

// 讀取日期並設定為兩位數
const day = String(currentDate.getDate()).padStart(2, '0'); 
// 讀取小時並設定為兩位數
const hour = String(currentDate.getHours()).padStart(2, '0'); 
const currentDateTime = `${year}${month}${day}-${hour}`;

// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@192.168.50.115:27017/');
//建立DB功能
const db = mongoose.connection;
//當連線有問題時
db.on('error', console.error.bind(console, 'connection error:'));
//如果成功會回復onnected to MongoDB
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// 定義數據模型
const containerDataSchema = new mongoose.Schema({
    timestamp: String,
    container_id: String,
    container_name: String,
    cpu_percentage: String,
});
//數據加入至MongoDB中
const ContainerData = mongoose.model('CPUstats', containerDataSchema);

// 讀取並處理 JSON 數據
fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', async (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }

    const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
    
    try {
        // 將數據保存到 MongoDB 中
     const result = await ContainerData.insertMany(dictionaries);
	console.log('成功保存數據到 MongoDB：', result);
    } catch (err) {
        console.error('保存數據到 MongoDB 失敗：', err);
    } finally {
        // 關閉數據庫連接
        mongoose.connection.close();
    }
});

