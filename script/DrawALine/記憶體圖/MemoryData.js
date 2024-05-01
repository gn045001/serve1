// version: 0.1, date: 20240430, Creator: jiasian.lin

//小作品用處 監控docker 確認 docker 狀態的網頁report 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置
//GitHub

//Dokcer Hub


//  pre-request  
// [projDir] project
//   +-- [rawDir] raw 
//   +-- [rptDir] report => Gitlab.json,....
//   +-- [tmpDir] temp
//   +-- [logDir] log => Summer.log

//section 1:工具套件
//工具套件
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');


//section 2:mongoDB 數據讀取


mongoose.connect('mongodb://admin:gn045001@localhost:27017/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

//section 3:設定資料的天數

//取一天內的資料
const oneDaysAgo = new Date();
oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

const app = express();


//section 4:Line Notify API相關設定
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


//寫入至diskreportSummerlog
//errorlog
const Summerlog = 'report/diskreportSummer.log'




//section 5: 定義數據
const containerDataSchema = new mongoose.Schema({
    timestamp: String,
    container_name: String,   
    memory_percentage: String,    
    memory_usage: String,
});
//選擇資料庫並
 const ContainerData = mongoose.model('memories', containerDataSchema);

 

//section 6: 將資料回傳至 /MemoryData.html 瀏覽器中 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/MemoryData.html');
});

// 一天資料藉由GitLaboneDaysgetDat回傳至HTML
app.get('/GitLaboneDaysgetData', async (req, res) => {
    try {
        //選擇container_name為gitlab
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));

        res.json({ labels, memoryPercentages });


        // 輸出 JSON 檔案
        fs.writeFileSync('report/GitLabdata.json', JSON.stringify(data, null, 2));
        console.log('Data saved as JSON.');


    } catch (err) {
        //如果要mongoDB問題出現告警
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        
        //Line 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log('mongoDB出問題:', response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })
        
        

        //寫進Summer log日誌
        fs.appendFile(Summerlog, 'mongoDB不正常'+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        }
});

app.get('/jenkinsoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });
        
        console.log('Data from MongoDB for Jenkins:', data); 
         // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        
        res.json({ labels, memoryPercentages });
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


app.get('/mongodboneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端 Chart.js 需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));

        res.json({ labels, memoryPercentages });
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


app.get('/redmineoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端 Chart.js 需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));

        res.json({ labels, memoryPercentages });
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


app.get('/sonarqubeoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端 Chart.js 需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));

        res.json({ labels, memoryPercentages });
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


