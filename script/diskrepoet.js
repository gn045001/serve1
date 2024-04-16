// version: 0.1, date: 20240414, Creator: jiasian.lin
const ejs = require('ejs');
const fs = require('fs');

// 獲取時間到小時
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 13).replace(/[-T:]/g, '');

// 輸出Html的資料
const fileName = `report/${formattedDate}_diskoutput.html`;

// 讀取raw的JSON 文件的内容
fs.readFile('raw/DiskSpace.json', 'utf8', (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }
    const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
    console.log('解讀數據：', dictionaries);

    // 生成 HTML
    const template = fs.readFileSync('script/template.ejs', 'utf8');
    const renderedHtml = ejs.render(template, { dictionaries: dictionaries });
    console.log(renderedHtml);

    // 當按輸出report至小時
    fs.writeFile(fileName, renderedHtml, (err) => {
        if (err) {
            console.error('寫入錯誤', err);
            return;
        }
        console.log('HTML 已成功寫入');
    });
});

