const mongoose = require('mongoose');  // 引入 mongoose，用於 MongoDB 數據庫操作
const fs = require('fs');

// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@localhost:27017/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// 定義數據模型
const containerDataSchema = new mongoose.Schema({
    timestamp: String,
    container_id: String,
    container_name: String,
    memory_usage: String,
    memory_percentage: String,
});

const ContainerData = mongoose.model('memory', containerDataSchema);

// 讀取並處理 JSON 數據
fs.readFile('raw/ComputerStart.json', 'utf8', async (err, data) => {
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


