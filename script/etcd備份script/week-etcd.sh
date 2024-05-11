#!/bin/sh
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
