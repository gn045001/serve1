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
  
  Drawalinecpuusagechart

     1. docker run -p 2000:2000 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinecpuusagechart
     2. docker run -p 2001:2001 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinememoryusagechart
     3. docker run -p 2002:2002  dockercpuinformationreport
     4. docker run -p 2003:2003  dockermemoryinformationreport

## 專案圖片示例

![server1](https://i.imgur.com/7cbe5qJ.png)

## 執行結果

### 收集資料
為了有效監控 Docker 容器的運行狀態，我們需要定期收集相關的統計信息。為了實現這一目標，我們使用了兩個腳本：dockdata.sh 和 dockerstatus.sh。

為了每分鐘收集一次 Docker 統計信息並將其存儲為 JSON 文件，我們可以使用一個名為 'dockdata.sh' 的 shell 腳本。該腳本定期運行，每分鐘收集 Docker 統計信息，然後將其保存為 JSON 文件。這些文件將在一小時後通過另一個腳本 'dockerstatus.sh' 創建的文件夾中組織和存儲。

首先，我們需要修改 'dockdata.sh' 腳本，以便它每分鐘運行一次並將結果保存為 JSON 文件。然後，我們將編寫 'dockerstatus.sh' 腳本，以在一小時後創建所需的文件夾結構。

這樣的設置可讓我們有效監控 Docker 的運行狀態和磁盤空間使用情況，並在需要時輕鬆檢視過去一小時的數據。這對於 Docker 環境的監控和管理非常有用。

為了實現每分鐘收集 Docker 統計信息並將其存儲為 JSON 文件的目標，我們需要修改 'dockdata.sh' 腳本，以便將 JSON 文件保存到適當的文件夾中。首先，在 'dockdata.sh' 中添加程式碼來收集 Docker 統計信息並將其轉換為 JSON 格式。

然後，修改程式碼以將 JSON 文件保存到指定的文件夾中。最後，在 'dockerstatus.sh' 中，我們需要添加程式碼以在一小時後創建相應的文件夾。這樣就能確保每分鐘收集到的 Docker 統計信息會在適當的時間保存在正確的文件夾中，以供稍後分析和使用。

### 個別資料夾執行各種需求
    每隔五分鐘，我們使用以下指令在Docker容器中運行特定映像檔，以生成報告：
      每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
      容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/diskreport/raw/，將 /app/report 掛載到 /home/gn045001/diskreport/report
      執行 diskreport 容器，生成報告
      5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport # 生成報告
      
      每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
      將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
      執行 dockercpureport 容器，生成報告
      5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport # 生成報告
      
      每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
      將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
      執行 dockermemoryreport 容器，生成報告
      5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport # 生成報告
      
      # 生成個別的 HTML 報告，如果執行出現問題，將通過 Line Notify 顯示警告
      # 並通過警告來確認硬碟空間或 dockdata.sh 和 dockerstatus.sh 的執行是否正常

    
    這些報告將被用於監控系統狀態。如果生成報告的過程中出現任何問題，我們將通過Line Notify進行告警通知。透過這些告警，我們可以確保硬碟空間使用正常，並且'dockdata.sh'和'dockerstatus.sh'這兩個腳本的執行也正常運作。
    在日常系統管理中，自動化程式變得越來越普遍。通過使用Docker容器和定期運行的腳本，我們可以輕鬆地生成各種報告來監控系統狀態。
    這種方式不僅提高了效率，還幫助我們及時發現並解決潛在的問題。透過Line Notify的告警通知，我們能夠第一時間得知異常情況，並迅速做出反應，保證系統的穩定運行。
    這種自動化監控方法不僅適用於個人電腦，也適用於企業級的伺服器和雲端架構。
### dockerstats資料夾執行加入至DB
   每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
   將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/dockerstats/raw/，將 /app/log 掛載到 /home/gn045001/dockerstats/inputcpudatamongodblog
   執行 inputcpudatamongodb 容器，將資料加入至 MongoDB
   4 5 * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已

  每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
  將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/dockerstats/raw/，將 /app/log 掛載到 /home/gn045001/dockerstats/inputmemorydatamongodblog
  執行 inputmemorydatamongodb 容器，將資料加入至 MongoDB
  5 5 * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已

  每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
  將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/dockerstats/raw/，將 /app/log 掛載到 /home/gn045001/dockerstats/log
  執行 dockerstats 容器，將資料加入至 MongoDB
  6 5 * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已

  每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
  將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/diskreport/raw/，將 /app/report 掛載到 /home/gn045001/diskreport/report
  執行 diskreport 容器，生成報告

透過 Docker 容器定期將資料加入至資料庫，可以有效地管理和分析系統資源使用情況。
設定定時任務，將容器資料掛載到本地目錄，再透過容器執行指令將資料加入至 MongoDB 資料庫。
這樣的作法不僅能夠自動化資料收集和儲存，還能夠提高系統監控和資料分析的效率。
透過這種方式，我們可以及時了解系統的運行狀況，並做出相應的優化和改進，從而提高系統的穩定性和效率。

另一方面，定期執行容器將 Docker 監控數據加入至資料庫，可以實現對系統狀態的全面追蹤。
這些數據包括 CPU 和內存使用情況等重要信息，通過將其加入至資料庫，可以方便地進行後續分析和優化。
同時，定期的監控和加入至資料庫的操作，也有助於提前發現系統問題，並採取相應措施，保障系統的穩定運行。
這種監控和加入至資料庫的方式，對於提高系統管理效率和確保系統安全性都具有重要意義。
    

