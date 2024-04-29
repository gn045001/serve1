// version: 0.1, date: 20240430, Creator: jiasian.lin

//小作品用處 監控docker 確認 docker 狀態的網頁report 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置
//GitHub

//Dokcer Hub


//  pre-request
// [projDir] project
//   +-- [rawDir] raw 
//   +-- [rptDir] report =>dockerInformationreport.csv 、 dockerInformationreport.json
//   +-- [tmpDir] temp
//   +-- [logDir] log


const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://admin:gn045001@localhost:27017/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

//資料天數設定

//取七天內的資料
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//取五天內的資料
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);


//取三天內的資料
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);


//取二天內的資料
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);


//取一天內的資料
const oneDaysAgo = new Date();
oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);



const app = express();

// 定义数据模型
const containerDataSchema = new mongoose.Schema({
    timestamp: String,
    container_name: String,
    cpu_percentage: String,
});

 const ContainerData = mongoose.model('cpustats', containerDataSchema);


// 返回 index.html 文件
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dockerInformationreportindex.html');
});
//gitlab
// 一天資料回傳
app.get('/GitLaboneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/GitLabtwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/GitLabthreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/GitLabfiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/GitLabsevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


//my-mongodb
// 一天資料回傳
app.get('/gifted_dubinskyoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/gifted_dubinskytwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/gifted_dubinskythreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/gifted_dubinskyfiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/gifted_dubinskysevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


//my-mongodb
// 一天資料回傳
app.get('/my-mongodboneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/my-mongodbtwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/my-mongodbthreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/my-mongodbfiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/my-mongodbsevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

