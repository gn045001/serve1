// version: 0.1, date: 20240430, Creator: jiasian.lin
// version: 0.2, date: 20240504, Creator: jiasian.lin
//當很多資料都沒呈現敏顯得波段時就很亂
// S
//小作品用處 監控docker 確認 docker 狀態的網頁report 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置
//GitHub
//
//https://github.com/gn045001/serve1

//Dokcer Hub
//https://hub.docker.com/repository/docker/gn045001/dockerstate/tags

//  pre-request  
// [projDir] project
//   +-- [rawDir] raw 
//   +-- [rptDir] report 
//=> Memory_GitLabdata.json ,Memory_jenkinsbdata.json ,Memory_Jenkinsdata.json ,Memory_mongodbdata.json ,Memory_redminedata.json ,Memory_sonarqubedata.json ,Summer.log
//=> Memory_GitLabdata.csv ,Memory_jenkinsbdata.csv ,Memory_Jenkinsdata.csv ,Memory_mongodbdata.csv ,Memory_redminedata.csv ,Memory_sonarqubedata.csv
//   +-- [tmpDir] temp
//   +-- [logDir] log 


//   +--
//section 1:工具套件
//   +--

//工具套件
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');


//   +--
//section 2:mongoDB 數據讀取
//   +--

mongoose.connect('mongodb://admin:gn045001@localhost:27017/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

//   +--
//section 3:設定資料的天數
//   +--
//取一天內的資料
const oneDaysAgo = new Date();
oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

const app = express();

//   +--
//section 4:Line Notify API相關設定
//   +--
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
//設定網頁的port
const port = 2001;
//   +--
//section 5: Pathway Summerlog
//   +--

// log and report Pathway 的位置

const Summerlog = 'report/Summer.log'
const GitLabreport = 'report/Memory_GitLabdata.json'
const jenkinsreport = 'report/Memory_jenkinsbdata.json'
const mongodbreport = 'report/Memory_mongodbdata.json'
const redminereport = 'report/Memory_redminedata.json'
const sonarqubereport = 'report/Memory_sonarqubedata.json'


const GitLabreportcsv = 'report/Memory_GitLabdata.csv'
const jenkinsreportcsv = 'report/Memory_jenkinsbdata.csv'
const mongodbreportcsv = 'report/Memory_mongodbdata.csv'
const redminereportcsv = 'report/Memory_redminedata.csv'
const sonarqubereportcsv = 'report/Memory_sonarqubedata.csv'

//   +--
//section 6: 定義數據
//   +-- 

// 設定mongoose 取出來值的定義 containerDataSchema 

const containerDataSchema = new mongoose.Schema({
    timestamp: String,
    container_name: String,   
    memory_percentage: String,    
    memory_usage: String,
});

//選擇資料庫並
const ContainerData = mongoose.model('memories', containerDataSchema);

//   +--
//section 7: 將資料回傳至 /MemoryData.html 瀏覽器中 
//   +--

// 讀取html 的結構
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/MemoryData.html');
});

// 一天資料藉由GitLaboneDaysgetDat回傳至HTML
//GitLab寫進Summer log日誌
fs.appendFile(Summerlog, `${oneDaysAgo},GitLaboneDaysgetDat要執行了`+ '\n', (err) => {
    if (err) {
        console.error('GitLaboneDaysgetDat將要執行有問題', err);
        return;
        }
        console.log('GitLaboneDaysgetDat將要執行沒有問題')
});

//處理 GET 請求在網站或應用程式中    
app.get('/GitLaboneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 gitlab 且時間戳大於等於昨天的資料,選擇container_name為gitlab
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));

        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });


        // 輸出 JSON 檔案
        fs.writeFileSync(GitLabreport, JSON.stringify(data, null, 2));
                // GitLabreport Read JSON data from file
                fs.readFile(GitLabreport, 'utf8', (err, data) => {
                    if (err) {
                    console.error('Error reading JSON file:', err);
                    return;
                    }
                
                    try {
                    // Parse JSON data
                    const jsonData = JSON.parse(data);
                
                    // Convert JSON to CSV
                    const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
                
                    // Write CSV data to a file
                    fs.writeFileSync(GitLabreportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
                
        
                    } catch (err) {
                    console.error('Error parsing JSON data:', err);
                    }
                });

    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        //Line Notify API相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })
        
        //發送 Line Notify 告警
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
        

        //寫入Summer log日誌
        fs.appendFile(Summerlog, 'mongoDB不正常'+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        }
});

// 從資料庫查詢 container_name 為 gitlab 且時間戳大於等於昨天的資料
    fs.appendFile(Summerlog, `${oneDaysAgo},GitLaboneDaysgetDat執行完畢且正常`+ '\n', (err) => {
        if (err) {
            console.error('GitLaboneDaysgetDat將要執行有問題', err);
            return;
            }
            console.log('GitLaboneDaysgetDat將要執行沒有問題')
    });



//jenkin狀態,寫進Summer log日誌
fs.appendFile(Summerlog, `${oneDaysAgo}, jenkin狀態的mongoDB取得數據\n`, (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });      


//一天資料藉由jenkinsoneDaysgetData回傳至HTML
//處理 GET 請求在網站或應用程式中
app.get('/jenkinsoneDaysgetData', async (req, res) => {
    try {
// 從資料庫查詢 container_name 為 gifted_dubinsky 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });        

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(jenkinsreport, JSON.stringify(data, null, 2));        
        
        // jenkinreport Read JSON data from file
        fs.readFile(jenkinsreport, 'utf8', (err, data) => {
            if (err) {
            console.error('Error reading JSON file:', err);
            return;
            }
        
            try {
            // Parse JSON data
            const jsonData = JSON.parse(data);
        
            // Convert JSON to CSV
            const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
        
            // Write CSV data to a file
            fs.writeFileSync(jenkinsreportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
        

            } catch (err) {
            console.error('Error parsing JSON data:', err);
            }
        });
    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });

        //   +--
        //設定 Line Notify API 相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })

        //發送 Line Notify 告警
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
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
});

//寫進Summer log日誌
fs.appendFile(Summerlog, `${oneDaysAgo}, jenkins狀態的mongoDB取得數據\n`, (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });

//mongoDB狀態,寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });   

//一天資料藉由mongodboneDaysgetData回傳至HTM 
//處理 GET 請求在網站或應用程式中

app.get('/mongodboneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 my-mongodb 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(mongodbreport, JSON.stringify(data, null, 2));

             // mongodbreport Read JSON data from file
             fs.readFile(mongodbreport, 'utf8', (err, data) => {
                if (err) {
                console.error('Error reading JSON file:', err);
                return;
                }
            
                try {
                // Parse JSON data
                const jsonData = JSON.parse(data);
            
                // Convert JSON to CSV
                const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
            
                // Write CSV data to a file
                fs.writeFileSync(mongodbreportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
            
    
                } catch (err) {
                console.error('Error parsing JSON data:', err);
                }
            });

    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        //Line Notify API相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })
        
        // 發送 Line Notify 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log( `${oneDaysAgo},mongoDB出問題:`, response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })       
        

        //寫進Summer log日誌
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
    
});


//寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo}, mongoDB狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });

//redmine狀態,寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},redmine狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });   


//一天資料藉由redmineoneDaysgetData回傳至HTM 
//處理 GET 請求在網站或應用程式中

app.get('/redmineoneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 some-redmine 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(redminereport, JSON.stringify(data, null, 2));

        
        // redminereport Read JSON data from file
        fs.readFile(redminereport, 'utf8', (err, data) => {
            if (err) {
            console.error('Error reading JSON file:', err);
            return;
            }
        
            try {
            // Parse JSON data
            const jsonData = JSON.parse(data);
        
            // Convert JSON to CSV
            const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
        
            // Write CSV data to a file
            fs.writeFileSync(redminereportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
        

            } catch (err) {
            console.error('Error parsing JSON data:', err);
            }
        });


    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        //Line Notify API相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })      
                
        // 發送 Line Notify 告警
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
        

        // 寫入 Summer log 日誌
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
});

//寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},redmine狀態的 mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });

//sonarqub狀態,寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},sonarqub狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });   


//一天資料藉由sonarqubeoneDaysgetData回傳至HTML
//處理 GET 請求在網站或應用程式中
app.get('/sonarqubeoneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 sonarqube 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(sonarqubereport, JSON.stringify(data, null, 2));

        // sonarqube Read JSON data from file
            fs.readFile(sonarqubereport, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return;
                }
                    
                try {
                // Parse JSON data
                const jsonData = JSON.parse(data);
                    
                // Convert JSON to CSV
                const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
                    
                // Write CSV data to a file
                fs.writeFileSync(sonarqubereportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
                    
            
                } catch (err) {
                console.error('Error parsing JSON data:', err);
                }
            });

    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        // 設定 Line Notify API 相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })        
        
        // 發送 Line Notify 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log( `${oneDaysAgo},mongoDB出問題:`, response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })       
        

        //寫進Summer log日誌
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
});

//   +--
//section 7:監聽 port 3000，當伺服器啟動後輸出訊息到控制台
//   +--



// 監聽端口
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


//寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},已執行結束`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });
