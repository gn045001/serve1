// version: 0.1, date: 20240506, Creator: jiasian.lin

//用來檢查 OC 的 How to list all OpenShift TLS certificate expire date 
//參考網頁:https://access.redhat.com/solutions/3930291
//OpenShift TLS證書是用於OpenShift集群中安全通信的數字證書。TLS證書用於加密和驗證網絡通信，確保通信在客戶端和伺服器之間是私密和安全的。
//
//在OpenShift中，TLS證書通常用於以下目的：
//
//對OpenShift管理控制台（Web界面）和API服務進行加密通信。
//保護應用程序之間的通信，例如用戶端應用程序和後端服務之間的通信。
//保護OpenShift路由器（Router）提供的外部訪問。
//TLS證書由一個私鑰（Private Key）和相對應的公共證書（Public Certificate）組成。私鑰用於加密通信，而公共證書則用於驗證和解密通信。當OpenShift中的TLS證書到期時，需要更新證書以確保安全通信的持續性。

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
//
//https://github.com/gn045001/serve1

//Dokcer Hub
//https://hub.docker.com/repository/docker/gn045001/dockerstate/tags


//我的小作品相關設定
//Docker configuration in crontab -e
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已


//section 1: 環境變數
// 載入 fs 模組用於讀取檔案
const fs = require('fs');
//寫入至Summerlog
const mongoose = require('mongoose');
// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
//建立DB功能
const db = mongoose.connection;
//section 2:執行環境的資料夾之環境變數
//當連線有問題時
db.on('error', console.error.bind(console, 'connection error:'));
//如果成功會回復onnected to MongoDB
db.once('open', function () {
    console.log('Connected to MongoDB');
});

//section 3:定義數據的模型並寫入至DB中
//定義數據模型
const containerDataSchema = new mongoose.Schema({
    NAMESPACE: String,
    NAME: String,
    EXPIRY: String,
});

const ContainerData = mongoose.model('openshift', containerDataSchema);
// 讀取並處理 JSON 數據
fs.readFile(`Ocsecrets.json`, 'utf8', async (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        process.exit(1);
        return;
    }

    try {
        // 即將數據保存到 MongoDB 中
        const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
        
        const result = await ContainerData.insertMany(dictionaries);
        console.log('成功保存數據到 MongoDB：', result);

        const allRecords = await ContainerData.find({}, 'NAMESPACE NAME EXPIRY');

        const currentYear = new Date().getFullYear();
        const expiriesThisYear = allRecords.filter(record => {
            const yearMatch = record.EXPIRY.match(/(\d{4}) GMT/);
            return yearMatch && parseInt(yearMatch[1]) === currentYear;
        });
       
        if (expiriesThisYear.length > 0) {
            console.log(`發現 ${expiriesThisYear.length} 紀錄Expiry 中年份與今年相同`);
            expiriesThisYear.forEach(record => {
                console.log(`NAMESPACE: ${record.NAMESPACE}, NAME: ${record.NAME}, EXPIRY: ${record.EXPIRY}`);
            });
            
            // 將數據轉換為 CSV 字符串
            const csvData = expiriesThisYear.map(record => `${record.NAMESPACE},${record.NAME},${record.EXPIRY}`).join('\n');
            
            // 將 CSV 寫入文件
            fs.writeFile('report/output.csv', csvData, 'utf8', (err) => {
                if (err) {
                    console.error('寫入 CSV 文件時發生錯誤：', err);
                    return;
                }
                console.log('成功將數據寫入 CSV 文件！');
            });
        } else {
            console.log('沒有發現 EXPIRY 中年份與今年相同的紀錄。');
        }
    } catch (err) {
        console.error('保存數據到 MongoDB 失敗：', err);
    } finally {
        // 關閉數據庫連接
        mongoose.connection.close();
    }
});

