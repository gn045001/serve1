#!/bin/bash

#= version: 0.1, date: 20240405, Creater: jiasian.lin
#  pre-request
# [projDir] project
#   +-- [rawDir] raw 
#   +-- [rptDir] report 
#   +-- [tmpDir] temp 
#   +-- [logDir] log => /log/SettingSummary.log"


#小作品用處 監控docker 確認 docker 狀態 如果將以上作品放置 Openshift 或 k8s 運轉
#順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
#我的小作品下載位置
#GitHub
#=https://github.com/gn045001/serve1

#Dokcer Hub
#= https://hub.docker.com/repository/docker/gn045001/dockerstate/tags
#我的小作品相關設定
#docker 
#docker stats 的相關資訊寫成JSON
#dcoker ps 的相關資訊寫成JSON
#Docker configuration in crontab -e
#確認電腦狀況
#docker shell script 進行執行狀態觀察
#* * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockdata.sh #取得docker stats 資料 ，第一步取得每分鐘的資料
#0 * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockerstatus.sh #取得放置相關位置並給予 docker進行執行，第二步將資料傳出去
#openshift 的容器藉由docker確認容器狀態 
#Docker 進行 crontab -e 每小時 5分時執行以下需求
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport #產生report
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport #產生report
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport #產生report
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已

# drawalinecpuusagechart
# docker run -p 2000:2000 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinecpuusagechart
# docker run -p 2001:2001 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinememoryusagechart
# docker run -p 2002:2002  dockercpuinformationreport
# docker run -p 2003:2003  dockermemoryinformationreport
# 將 kubelet 的設定檔案複製到指定目錄下的檔案中，這裡是複製到 /root/script/etcd/log/weekconfig.log
cat /var/lib/kubelet/config.yaml > /root/script/etcd/log/weekconfig.log

# 紀錄設定檔案複製完成的時間到日誌中
echo -e "$(date) 將 kubelet 的設定檔案複製到指定目錄下的檔案中完成" >> "$current_dir/etcd/log/SettingSummary.log"

# 備份 etcd 的快照到指定目錄下的檔案中，這裡是備份到 log/weeksnapshot.log
ETCDCTL_API=3 /usr/local/bin/etcdctl snapshot backup -h > log/weeksnapshot.log

# 紀錄 etcd 快照備份完成的時間到SettingSummary日誌中
echo -e "$(date) 將 kubelet 備份 etcd 的快照到指定目錄下的檔案中完成" >> "$current_dir/etcd/log/SettingSummary.log"

# 儲存 etcd 的快照到指定目錄下的檔案中，這裡是儲存 /root/script/etcd/3-week/week$(date +'%U')-snapshot.db
ETCDCTL_API=3 /usr/local/bin/etcdctl snapshot save /root/script/etcd/3-week/week$(date +'%U')-snapshot.db --cacert /etc/kubernetes/pki/etcd/ca.crt --cert /etc/kubernetes/pki/etcd/server.crt --key /etc/kubernetes/pki/etcd/server.key

# 紀錄 etcd 快照儲存完成的時間到SettingSummary日誌中
echo -e "$(date) 將 kubelet 儲存 etcd 的快照到指定目錄下的檔案中完成" >> "$current_dir/etcd/log/SettingSummary.log"

# 將 /etc/kubernetes/pki/etcd 目錄壓縮為指定名稱的檔案，這裡是壓縮為 /root/script/etcd/3-week/week$(date +'%U')-etcd.tar.gz
sudo tar -zcvf /root/script/etcd/3-week/week$(date +'%U')-etcd.tar.gz /etc/kubernetes/pki/etcd

# 紀錄 etcd 目錄壓縮完成的時間到SettingSummary日誌中
echo -e "$(date) /etc/kubernetes/pki/etcd 目錄壓縮為指定名稱的檔案，這裡是壓縮為 /root/script/etcd/3-week/week$(date +'%U')-etcd.tar.gz 完成" >> "$current_dir/etcd/log/SettingSummary.log"
