# 我的專案
建立一個監控 Docker 的自動化監控機制，利用 VMware 建立 Red Hat 和 OpenShift 環境。每分鐘監控 Docker 的運行狀態與硬碟空間資訊，並將其加入至 MongoDB 進行儲存。

## 系統設計方案
1. VMware 環境: 使用 VMware 建立虛擬機運行 Red Hat 和 OpenShift。
2. 容器管理平台: 在 Red Hat 和 OpenShift 中部署 Docker 容器。
## 目標
建立一個每分鐘監控 Docker 運行狀態和硬碟空間資訊的自動化監控機制，並將數據儲存至 MongoDB。

## 監控機制步驟
1. 設置 VMware 環境:
  使用 VMware 創建虛擬機以運行 Red Hat 和 OpenShift。

3. 部署 Red Hat 和 OpenShift:
  使用 VMware 工具在虛擬機中部署 Red Hat 和 OpenShift。

5. 安裝和配置 Docker:
  在 Red Hat 和 OpenShift 中安裝和配置 Docker。

6. 編寫監控腳本:
  編寫一個 Shell 或 Python 腳本來監控 Docker 容器的運行狀態和硬碟空間資訊。
  使用 docker stats 和 df 命令來獲取所需數據。
  在腳本中添加代碼，將監控數據儲存到 MongoDB 中。

7. 設置 Cron Job:
  使用 crontab 設置每分鐘運行一次的監控腳本。
      docker shell script 進行執行狀態觀察
   
       1. * * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockdata.sh #取得docker stats 資料 ，第一步取得每分鐘的資料   
       2. 0 * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockerstatus.sh #取得放置相關位置並給予 docker進行執行，第二步將資料傳出去
   
  使用 crontabe 設置每小時docker 運行一次資料整理腳本
  
      1. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport #產生report
      2. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport #產生report
      3. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport #產生report
      4. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
      5. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
      6. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已


## 專案圖片示例

![server1](https://i.imgur.com/7cbe5qJ.png)
