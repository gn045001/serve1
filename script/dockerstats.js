//version: 0.1, date: 20240413, Creater: jiasian.lin
//version: 0.1, date: 20240420, Creater: jiasian.lin
//新增 日期變數
//section 1:description 程式變數
const fs = require('fs');
const axios = require('axios');
const querystring = require('querystring');
//notebookPathErrorData
const notebookPathError = 'log/StatusError.log'
//Summerlog
const Summerlog = 'log/Summer.log'
// Line Notify 存取權杖
const accessToken = 'lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2';
// Line Notify API 端點
const url = 'https://notify-api.line.me/api/notify';

//時間變數
const now = new Date();
const year = now.getFullYear();

// 讀取月份並設定為兩位數
const month = String(now.getMonth() + 1).padStart(2, '0'); 

// 讀取日期並設定為兩位數
const day = String(now.getDate()).padStart(2, '0'); 

// 讀取小時並設定為兩位數
const hour = String(now.getHours()).padStart(2, '0'); 
const currentDateTime = `${year}${month}${day}-${hour}`;
// 設定 Line Notify
const config = {
    headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
    }
};

//section 2:description 讀取 JSON 文件的內容

fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }

const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
console.log('解析後的陣列：', dictionaries);
dictionaries.forEach(dict => {
console.log(`Docker Container: ${dict.timestamp}，Docker Contain CPU: ${dict.cpu_percentage}%，Docker Contain Memory Usage: ${dict.memory_percentage}%`);

// docker stats CPU狀態使用率，寫進Summer log日誌
fs.appendFile(Summerlog, '開始執行確認CPU狀況寫入log日誌已成功寫入'+ '\n', (err) => {
    if (err) {
        console.error('寫入log日誌有問題', err);
        return;
        }
        console.log('寫入log日誌已成功寫入')
    });

//section 3:description 確認docker stats CPU狀態
    switch (true) {
    //判斷docker stats CPU狀態使用率
    case parseFloat(dict.cpu_percentage) < 10:
        console.log(`CPU使用率小於 10% 的容器名稱為：${dict.container_name}，CPU值$：${dict.cpu_percentage}`);
        const CPUMessagelog = `正常範圍 CPU使用率小於 10% 的容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`;

        const CPUmessages = querystring.stringify({
            message: CPUMessagelog
        });

    // 發送 POST 請求到 Line Notify API
//		axios.post(url,CPUmessages, config)
//    		.then(response => {
//        	console.log('訊息發送成功:', response.data);
//    	    })
//    		.catch(error => {
//        	console.error('訊息發送失敗:', error.response.data);
//    	    });	
	// docker stats CPU狀態使用率，寫進StatusError log日誌
        fs.appendFile(notebookPathError, CPUMessagelog+ '\n', (err) => {
            if (err) {
                console.error('寫入log日誌有問題', err);
                return;
                }
                console.log('寫入log日誌已成功寫入')
            });
                break;
    // 判斷CPU使用率
        case parseFloat(dict.cpu_percentage) >= 10 && parseFloat(dict.cpu_percentage) <= 20:
        console.log(`CPU 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
        const CPUMessagelog2 =(`CPU 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
        const CPUmessages2 = querystring.stringify({
            message: CPUMessagelog2
        });

// 發送 POST 請求到 Line Notify API
//		axios.post(url,CPUmessages2, config)
//    		.then(response => {
//       	console.log('訊息發送成功:', response.data);
//    	    })
//    		.catch(error => {
//        	console.error('訊息發送失敗:', error.response.data);
//    	    });		
    // docker stats CPU狀態使用率，寫進StatusError log日誌
            fs.appendFile(notebookPathError, CPUMessagelog2+ '\n', (err) => {
                if (err) {
                    console.error('寫入log日誌有問題', err);
                    return;
                    }
                    console.log('寫入log日誌已成功寫入')
                });
                    break;
            case parseFloat(dict.cpu_percentage) > 20 && parseFloat(dict.cpu_percentage) <= 70:
                console.log(`CPU 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUMessagelog3 =(`CPU 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUmessages3 = querystring.stringify({
                    message: CPUMessagelog3
                });
        
    // 發送 POST 請求到 Line Notify API
//                axios.post(url,CPUmessages3, config) 
//                   .then(response => {
//                 console.log('訊息發送成功:', response.data);
//                    })
//                    .catch(error => {
//                    console.error('訊息發送失敗:', error.response.data);
//                    });	
    // docker stats CPU狀態使用率，寫進StatusError log日誌        
                fs.appendFile(notebookPathError, CPUMessagelog3+ '\n', (err) => {
                    if (err) {
                        console.error('寫入log日誌有問題', err);
                        return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
        
                break;
            case parseFloat(dict.cpu_percentage) > 70:
                console.log(`CPU 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUMessagelog4 =(`CPU 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUmessages4 = querystring.stringify({
                    message: CPUMessagelog4
                });
        
    // 發送 POST 請求到 Line Notify API
//                axios.post(url,CPUmessages4, config) 
//                   .then(response => {
//                 console.log('訊息發送成功:', response.data);
//                    })
//                    .catch(error => {
//                    console.error('訊息發送失敗:', error.response.data);
//                    });	
	// docker stats CPU狀態使用率，寫進StatusError log日誌
                fs.appendFile(notebookPathError, CPUMessagelog4+ '\n', (err) => {
                    if (err) {
                        console.error('寫入log日誌有問題', err);
                        return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
    // docker stats CPU狀態使用率，CPU使用率過高須注意，寫進Summer log日誌                
                fs.appendFile(Summerlog, 'CPU使用率過高須注意'+ '\n', (err) => {
                    if (err) {
                         console.error('寫入log日誌有問題', err);
                         return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
                break;
            default:
    // docker stats CPU狀態使用率，寫進StatusError log日誌
                fs.appendFile(Summerlog, 'memory值有問題請確認'+ '\n', (err) => {
                    if (err) {
                        console.error('寫入log日誌有問題', err);
                        return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
                break;
        }
    // docker stats CPU狀態使用率，寫進Summer log日誌
        fs.appendFile(Summerlog, '以確認CPU完畢寫入log日誌已成功寫入'+ '\n', (err) => {
            if (err) {
                console.error('寫入log日誌有問題', err);
                return;
                }
                console.log('寫入log日誌已成功寫入')
            });


//section 4:description 確認memory狀態
        fs.appendFile(Summerlog, '開始執行確認memory狀況'+ '\n', (err) => {
            if (err) {
                console.error('寫入log日誌有問題', err);
                return;
                }
                console.log('寫入log日誌已成功寫入')
            });

         switch (true) {
            case parseFloat(dict.memory_percentage) < 10:
                console.log(`memory 使用百分比小於 10% 的容器名稱為：${dict.container_name}，memory 使用量：${dict.memory_usage}，memory值：${dict.memory_percentage}`);
                const memoryMessagelog = `正常範圍memory 使用百分比小於 10% 的容器名稱為：${dict.container_name}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`;            
                const memorymessages = querystring.stringify({
                    message: memoryMessagelog
                });
            
                // 發送 POST 請求到 Line Notify API
//                    axios.post(url,memorymessages, config)
//                        .then(response => {
//                        console.log('訊息發送成功:', response.data);
//                        })
//                        .catch(error => {
//                        console.error('訊息發送失敗:', error.response.data);
//                        });	
                 // docker stats CPU狀態使用率，寫進StatusError log日誌
                    fs.appendFile(notebookPathError, memoryMessagelog+ '\n', (err) => {
                        if (err) {
                            console.error('寫入log日誌有問題', err);
                            return;
                            }
                            console.log('寫入log日誌已成功寫入')
                        });
                            break;
                case parseFloat(dict.memory_percentage) >= 10 && parseFloat(dict.memory_percentage) <= 20:
                    console.log(`memory 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                    const memoryMessagelog2 =(`memory 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                    const memorymessages2 = querystring.stringify({
                        message: memoryMessagelog2
                    });
            
                // 發送 POST 請求到 Line Notify API
//                    axios.post(url,memorymessages2, config)
 //                       .then(response => {
 //                       console.log('訊息發送成功:', response.data);
 //                       })
 //                       .catch(error => {
 //                       console.error('訊息發送失敗:', error.response.data);
 //                       });		
                // docker stats CPU狀態使用率，寫進StatusError log日誌 
                        fs.appendFile(notebookPathError, memoryMessagelog2+ '\n', (err) => {
                            if (err) {
                                console.error('寫入log日誌有問題', err);
                                return;
                                }
                                console.log('寫入log日誌已成功寫入')
                            });
            
                                break;
                        case parseFloat(dict.memory_percentage) > 20 && parseFloat(dict.memory_percentage) <= 70:
                            console.log(`memory 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                            const memoryMessagelog3 =(`memory 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                            const memorymessages3 = querystring.stringify({
                                message: memoryMessagelog3
                            });
                    
                // 發送 POST 請求到 Line Notify API
//                            axios.post(url,memorymessages3, config)
//                                .then(response => {
 //                               console.log('訊息發送成功:', response.data);
 //                               })
//                                .catch(error => {
 //                               console.error('訊息發送失敗:', error.response.data);
//                                });	
                // docker stats CPU狀態使用率，寫進StatusError log日誌    
                            fs.appendFile(notebookPathError, memoryMessagelog3+ '\n', (err) => {
                                if (err) {
                                    console.error('寫入log日誌有問題', err);
                                    return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                    
                            break;
                        case parseFloat(dict.memory_percentage) > 70:
                            console.log(`memory 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}急需要注意。`);
                            const memoryMessagelog4 =(`memory 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}急需要注意。`);
                            const memorymessages4 = querystring.stringify({
                                message: memoryMessagelog4
                            });
                    
                // 發送 POST 請求到 Line Notify API
//                            axios.post(url,memorymessages4, config)
//                                .then(response => {
//                                console.log('訊息發送成功:', response.data);
//                                })
//                                .catch(error => {
//                               console.error('訊息發送失敗:', error.response.data);
//                                });	
                // docker stats CPU狀態使用率，寫進StatusError log日誌
                            fs.appendFile(notebookPathError, memoryMessagelog4+ '\n', (err) => {
                                if (err) {
                                    console.error('寫入log日誌有問題', err);
                                    return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                // docker stats CPU狀態使用率，寫進Summer log日誌
                            fs.appendFile(Summerlog, 'memory使用率過高須注意'+ '\n', (err) => {
                                if (err) {
                                     console.error('寫入log日誌有問題', err);
                                     return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                            break;
                        default:
                // docker stats CPU狀態使用率，寫進Summer log日誌  
                            fs.appendFile(Summerlog, 'memory值有問題請確認'+ '\n', (err) => {
                                if (err) {
                                    console.error('寫入log日誌有問題', err);
                                    return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                            break;
                    }
                // docker stats CPU狀態使用率，寫進Summer log日誌        
                    fs.appendFile(Summerlog, '確認memory完畢'+ '\n', (err) => {
                        if (err) {
                            console.error('寫入log日誌有問題', err);
                            return;
                            }
                            console.log('寫入log日誌已成功寫入')
                        });


    // docker stats CPU狀態使用率，寫進Summer log日誌
    fs.appendFile(Summerlog, '以確認CPU完畢寫入log日誌已成功寫入'+ '\n', (err) => {
        if (err) {
            console.error('寫入log日誌有問題', err);
            return;
            }
            console.log('寫入log日誌已成功寫入')
        });
    });
});
