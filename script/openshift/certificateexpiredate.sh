#!/bin/bash
#= version: 0.1, date: 20240430, Creator: jiasian.lin
#= 用來檢查 OC 的 How to list all OpenShift TLS certificate expire date 
#= 參考網頁:https://access.redhat.com/solutions/3930291
#= OpenShift TLS證書是用於OpenShift集群中安全通信的數字證書。TLS證書用於加密和驗證網絡通信，確保通信在客戶端和伺服器之間是私密和安全的。
#= 
#= 在OpenShift中，TLS證書通常用於以下目的：
#= 
#= 對OpenShift管理控制台（Web界面）和API服務進行加密通信。
#= 保護應用程序之間的通信，例如用戶端應用程序和後端服務之間的通信。
#= 保護OpenShift路由器（Router）提供的外部訪問。
#= TLS證書由一個私鑰（Private Key）和相對應的公共證書（Public Certificate）組成。私鑰用於加密通信，而公共證書則用於驗證和解密通信。當OpenShift中的TLS證書到期時，需要更新證書以確保安全通信的持續性。

#=GitHub
#=
#=https://github.com/gn045001/serve1

#=Dokcer Hub
#=https://hub.docker.com/repository/docker/gn045001/dockerstate/tags

#=  pre-request  
#= [projDir] project
#=   +-- [rawDir] raw 
#=   +-- [rptDir] report => Ocsecrets.json
#=   +-- [tmpDir] temp => output.csv
#=   +-- [logDir] log => Summary.log

#section 1:description 程式變數
# line 的相關變數
TOKEN="lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2"


#section 3:取得OpenShift TLS證書相關資料
echo -e "$(date) 要取得OpenShift TLS證書  " >> "./log/Summary.log"
oc get secrets -A -o go-template='{{range .items}}{{if eq .type "kubernetes.io/tls"}}{{.metadata.namespace}}{{"\t"}}{{.metadata.name}}{{"\t"}}{{index .data "tls.crt"}}{{"\n"}}{{end}}{{end}}' | while IFS=$'\t' read -r namespace name cert; do if [ -n "$namespace" ] && [ -n "$name" ] && [ -n "$cert" ]; then expiry=$(echo "$cert" | base64 -d | openssl x509 -noout -enddate | sed 's/notAfter=#=//'); echo "{\"NAMESPACE\":\"$namespace\",\"NAME\":\"$name\",\"EXPIRY\":\"$expiry\"}"; fi; done > Ocsecrets.json
echo -e "$(date) OpenShift TLS證書以確認  " >> "./log/Summary.log"


#section 2:執行nodejs相關資料
echo -e "$(date) certificateexpiredate.js確認是否存在" >> "./log/Summary.log"
if [ ! -f "./script/certificateexpiredate.js" ]; then
    errorlog="執行OpenShift TLS證書產生CSV資料並加入至有問題需確認"
    curl -X POST \
        -H "Authorization: Bearer $TOKEN" \
        -F "message=$errorlog" \
        https://notify-api.line.me/api/notify

    echo -e "$(date)  $memoryalert 有使用量問題須告警" >> "./log/Summary.log"  
else
    echo -e "$(date) certificateexpiredate.js存在並執行OpenShift TLS證書產生CSV資料並加入至mongoDB中" >> "./log/Summary.log"
    node script/certificateexpiredate.js
    echo -e "$(date) 執行OpenShift TLS證書產生CSV資料並加入至mongoDB完畢" >> "./log/Summary.log"
fi
echo -e "$(date) certificateexpiredate.js以確認完畢" >> "./log/Summary.log"