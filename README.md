# 我的serve1專案
使用 VMware 建立 Red Hat 和 OpenShift 環境，實現一個自動化監控機制，監控 Docker 的運行狀態與硬碟空間資訊。此監控機制將每分鐘收集 Docker 的運行數據和硬碟使用情況，並將這些數據存儲到 MongoDB 中以便後續分析。整個系統將以容器化的形式運行，具體來說，是將監控機制封裝在一個 Docker 映像檔中，並在 OpenShift 的 Pod 中執行。這種方法不僅提高了監控機制的可移植性和靈活性，還能充分利用 Kubernetes 和 OpenShift 提供的編排與管理能力。

首先，利用 VMware 建立 Red Hat 作業系統環境，接著在此基礎上部署 OpenShift 平台，為容器化應用提供強大的運行和管理支持。監控機制本身包括兩個主要部分：一是數據收集腳本，定時（每分鐘）收集 Docker 的運行狀態和硬碟空間使用情況，二是數據存儲和分析系統，將收集到的數據存入 MongoDB 中，並提供數據整理和分析功能。

這樣的設計確保了數據收集的高效性和準確性，同時利用 MongoDB 的高性能數據處理能力，為後續的數據分析提供了堅實的基礎。通過將整個系統容器化並運行在 OpenShift 中，不僅簡化了部署和管理過程，還能充分利用雲原生技術的優勢，保證系統的高可用性和擴展性。

總之，此自動化監控機制為 Docker 環境提供了一個強大且靈活的監控方案，通過 VMware、Red Hat 和 OpenShift 的協同運作，實現了數據的高效收集、存儲和分析。

VMware: 用於建立虛擬機器。
Red Hat: 作為虛擬機器的操作系統。
OpenShift: 用於容器編排和管理。

## 系統設計方案
1. VMware 環境: 使用 VMware 建立虛擬機運行 Red Hat 和 OpenShift。
2. 容器管理平台: 在 Red Hat 和 OpenShift 中部署 Docker 容器。
## 目標
建立一個每分鐘監控 Docker 運行狀態和硬碟空間資訊的自動化監控機制，並將數據儲存至 MongoDB。

## 監控機制步驟
1.  環境準備

    -利用 VMware 建立 Red Hat 和 OpenShift 環境。
    -確保已安裝 Docker、MongoDB 及相關工具。
    
2.監控機制

    -每分鐘監控 Docker 的運行狀態與硬碟空間資訊。
    -使用 Shell 腳本收集 Docker 資料並存儲為 JSON 文件。
    
3.數據儲存

    -將收集到的數據加入至 MongoDB 進行儲存。
    
4.自動化執行

    -創建一個 Docker image，將監控腳本打包其中。
    -將此 Docker image 部署於 OpenShift 的 pod 中，以定時執行監控任務。
    
5.腳本範例

    -dockdata.sh: 每分鐘收集 Docker 資料並保存為 JSON 文件。
    -dockerstatus.sh: 每小時創建資料夾以存儲收集到的數據。
    
6.具體步驟

  VMware 設置:
    -建立 Red Hat 和 OpenShift 環境。
  Docker image 構建:
    -創建 Dockerfile，將監控腳本和所需依賴打包進 Docker image 中。
  部署到 OpenShift:
    -使用 OpenShift 部署該 Docker image，設置定時任務以每分鐘運行一次監控腳本。
7.改進建議

    -增加日誌功能，記錄監控過程中的錯誤和異常情況。
    -提供數據可視化界面，實時展示 Docker 的運行情況和硬碟使用狀態。
    -設置告警機制，當監控到異常情況時，發送通知至管理員。

8. 設置 Cron Job:
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

## 專案繪圖示例

![server1](https://i.imgur.com/7cbe5qJ.png)

### 繪圖的程式碼
利用 Diagram as Code 進行繪製
程式碼為 \temp\diagram\diagram.py
## 執行方法
需要有 Docker 和 Apache 及 MySQL，並將 serve1\script\網頁作品\jiasian\database\user.sql 加入到 MySQL 中。
### 執行docker images
     1. docker run -p 2000:2000 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinecpuusagechart
     2. docker run -p 2001:2001 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinememoryusagechart
     3. docker run -p 2002:2002  dockercpuinformationreport
     4. docker run -p 2003:2003  dockermemoryinformationreport
### 執行 apache 和 My-sql來進行 
      serve1\script\網頁作品\jiasian\index.html 
      index.html 
      內容:
      1.  自我介紹
      2.  部落格
      3. docker CPU使用的曲線圖，執行方式:  "docker run -p 2000:2000 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinecpuusagechart"
      4. docker Memory使用的曲線圖，執行方式:  "docker run -p 2001:2001 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinememoryusagechart"
      5. docker CPU使用的圖表，執行方式:  "docker run -p 2002:2002  dockercpuinformationreport"
      6. docker Memory使用的圖表，執行方式: "docker run -p 2003:2003  dockermemoryinformationreport"



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


### 定期監控 Docker 容器資源並加入資料庫的效率與重要性
    每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
    將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
    執行 dockercpureport 容器，生成報告
    5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport # 生成報告
    
    每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
    將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
    執行 dockermemoryreport 容器，生成報告
    5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport # 生成報告


    生成個別的 HTML 報告，如果執行出現問題，將通過 Line Notify 顯示警告，並通過警告來確認硬碟空間或 dockdata.sh 和 dockerstatus.sh 的執行是否正常。
    
    透過 Docker 容器定期將資料加入至資料庫，可以有效地管理和分析系統資源使用情況。設定定時任務，將容器資料掛載到本地目錄，再透過容器執行指令將資料加入至 MongoDB 資料庫。這樣的作法不僅能夠自動化資料收集和儲存，還能夠提高系統監控和資料分析的效率。透過這種方式，我們可以及時了解系統的運行狀況，並做出相應的優化和改進，從而提高系統的穩定性和效率。
    
    另一方面，定期執行容器將 Docker 監控數據加入至資料庫，可以實現對系統狀態的全面追蹤。這些數據包括 CPU 和內存使用情況等重要信息，通過將其加入至資料庫，可以方便地進行後續分析和優化。同時，定期的監控和加入至資料庫的操作，也有助於提前發現系統問題，並採取相應措施，保障系統的穩定運行。這種監控和加入至資料庫的方式，對於提高系統管理效率和確保系統安全性都具有重要意義。
    
    透過 Docker 容器定期將 MongoDB 內的 Docker CPU 與記憶體相關資料利用圖表呈現，可以直觀地了解系統的資源使用情況。設定定時任務，將容器資料掛載到本地目錄，再透過容器執行指令將資料呈現成圖表，並使用不同的埠號對應不同的資源類型，例如 CPU 使用率和記憶體使用情況等。這樣的作法不僅能夠自動化資料呈現，還能夠提高系統監控和資料分析的效率。透過這種方式，我們可以及時了解系統資源的分配情況，並做出相應的調整，從而提高系統的運行效率和穩定性。

## Openshift  自動化監控和管理證書過期狀態是確保系統安全運行
在現代 IT 環境中，自動化監控和管理證書過期狀態是確保系統安全運行的關鍵。本文將介紹如何通過一個整合 Shell 腳本和 Node.js 應用的解決方案，來自動化監控 OpenShift 證書的過期狀態，並將數據儲存到 MongoDB 中。

方案概述
我們的解決方案包含兩個主要部分：

Shell 腳本 certificateexpiredate.sh：該腳本執行 Node.js 腳本 certificateexpiredate.js，從而生成證書過期數據並將其存儲到 MongoDB 中。
Node.js 應用 openshiftreport.js：這個應用在 2005 端口運行，提供一個 web 接口，用於檢查證書是否即將過期。
Shell 腳本：certificateexpiredate.sh
首先，我們需要創建一個 Shell 腳本 certificateexpiredate.sh，該腳本會執行 certificateexpiredate.js，並將結果存儲為 JSON 文件，同時將數據插入到 MongoDB 中。

在現代企業中，確保系統的穩定運行和安全性至關重要。為了實現這一目標，監控證書的有效期是不可或缺的一環。通過定期檢查和更新證書，可以避免因證書過期而導致的服務中斷或安全漏洞。

自動化監控過程
certificateexpiredate.sh：這是一個強大的腳本，設計用來檢查系統中所有重要證書的有效期。當腳本執行時，它會掃描指定目錄中的證書，提取它們的過期日期，並將這些信息存儲在 MongoDB 資料庫中。這樣一來，系統管理員可以方便地查詢和分析證書的有效期信息。此外，腳本還會生成一個 JSON 文件，其中包含了所有證書的詳細信息，便於後續的數據處理和報告生成。

openshiftreport.js：這是一個基於 Node.js 的應用程序，它的主要功能是提供一個 web 服務，用於展示證書的有效期信息。當應用程序啟動時，它會監聽 2005 端口，並從 MongoDB 中提取證書的有效期數據，生成一個動態報告。通過訪問該端口，系統管理員可以方便地查看所有證書的當前狀態，並及時發現即將過期的證書。這樣一來，管理員就可以提前採取措施，更新即將過期的證書，從而避免服務中斷和安全風險。

整合的效益
這兩個工具的結合使用，不僅提高了證書管理的效率，還增強了系統的安全性。通過自動化檢查和報告生成，系統管理員可以將更多的時間和精力投入到其他重要任務中。此外，將證書信息存儲在 MongoDB 中，還便於數據的長期存檔和歷史查詢。這樣的設計不僅提高了管理的便捷性，還為系統的持續運行提供了可靠保障。

結論
certificateexpiredate.sh 和 openshiftreport.js 是兩個非常實用的工具，它們通過自動化的方式，幫助系統管理員高效地管理和監控證書的有效期。通過這樣的工具組合，企業可以大幅降低因證書過期而帶來的風險，確保系統的穩定運行和數據安全。

## JumpServer.yaml 建立一個跳板機
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: infinite-sleep-pod
    spec:
      containers:
        - name: infinite-sleep-container
          image: alpine:latest
          command: ["/bin/sh"]
          args: ["-c", "while true; do sleep 3600; done"]


## 測試作品的mogotest.yaml檔

    apiVersion: v1
    kind: Service
    metadata:
      name: nginx-service
    spec:
      selector:
        app: nginx
      ports:
        - protocol: TCP
          port: 80
          targetPort: 80
    
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name:  webservice1
      labels:
        app: nginx
    spec:
      containers:
        - name: webservice1
          image: gn045001/openshiftdata:webservice1
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: webservice2
      labels:
        app: nginx
    spec:
      containers:
        - name: webservice2
          image: gn045001/openshiftdata:webservice2
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name:  webservice3
      labels:
        app: nginx
    spec:
      containers:
        - name: webservice3
          image: gn045001/openshiftdata:webservice3test
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: mongo
      labels:
        app: nginx
    spec:
      containers:
        - name: mongo
          image: gn045001/openshiftdata:mongo

