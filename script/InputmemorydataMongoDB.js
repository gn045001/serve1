//version: 0.1, date: 20240420, Creater: jiasian.lin
//version: 0.2, date: 20240424, Creater: jiasian.lin

//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report 
//   +-- [tmpDir] temp
//   +-- [logDir] log => memorySummer.log



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



//section 1:執行環境的資料夾之環境變數
//執行MongoDB數據庫
const mongoose = require('mongoose'); 
//讀取ComputerStart.json資料
const fs = require('fs');
//寫入至Summerlog
const Summerlog = 'log/memorySummer.log'

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

//檔案位置
const filePath = `raw/${currentDateTime}-ComputerStart.json`;

//section 3:執行環境的資料夾之環境變數
if (fs.existsSync(filePath)) {
// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@192.168.50.115:27017/');
//建立DB功能
const db = mongoose.connection;
// docker stats  memory狀態使用率，寫進Summer log日誌
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
//定義數據模型
const containerDataSchema = new mongoose.Schema({
    timestamp: String,
    container_id: String,
    container_name: String,
    memory_usage: String,
    memory_percentage: String,
});

const ContainerData = mongoose.model('memory', containerDataSchema);

// 讀取並處理 JSON 數據
fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', async (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }
    
    const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));

    try {
        // 即將數據保存到 MongoDB 中
        const result = await ContainerData.insertMany(dictionaries);
        console.log('成功保存數據到 MongoDB：', result);
    } catch (err) {
        console.error('保存數據到 MongoDB 失敗：', err);
    } finally {
        // 關閉數據庫連接
        mongoose.connection.close();
    }
        
    // docker stats memory狀態使用率，寫進Summer log日誌
    fs.appendFile(Summerlog, '以確認memory資料完畢寫入log日誌已成功寫入'+ '\n', (err) => {
        if (err) {
            console.error('寫入log日誌有問題', err);
            return;
            }
            console.log('寫入log日誌已成功寫入')
    }); 
});
}else{
    console.error('ComputerStart.json檔案不存在Input  memory data to MongoDB失敗，離開程式');
    // 發送 POST 請求到 Line Notify API
        const  memoryMessagelog = `error ComputerStart.json 檔案不見須注意`;            
        const  memoryMessages = querystring.stringify({
            message:  memoryMessagelog
        });
        // 發送 POST 請求到 Line Notify API
        axios.post(url, memoryMessages, config)
            .then(response => {
            console.log('因為ComputerStart.json資料缺少發送訊息Line發送訊息:', response.data);
            fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
                if (err) {
                    console.error('Line發送訊息有問題', err);
                    return;
                    }
                    console.log('Line發送訊息沒問題')
                });
            })
            .catch(error => {
            console.error('error ComputerStart.json 檔案不見須注意:', error.response.data);
            fs.appendFile(Summerlog, '訊息發送失敗'+ '\n', (err) => {
            if (err) {
                console.error('error ComputerStart.json 檔案不見須注意寫輸入Summerlog成功', err);
                return;
                }
                console.log('error ComputerStart.json 檔案不見須注意且寫輸入Summerlog失敗')
                });
            });  
}