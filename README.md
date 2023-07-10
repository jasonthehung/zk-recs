# zk-recs

論文連結：to be continued...

注意：若要實際執行 G 演算法，需要先至[snarkjs github](https://github.com/iden3/snarkjs/blob/master/README.md#7-prepare-phase-2)下載.ptau 檔案，此電路需要至少下載 ptau 23 的.ptau 檔，下載完成後將檔案名稱改為 final_23.ptau 並放置在 ptau 目錄下

## Folders

---

### **Circuits** folder

-   所有會使用到的電路程式碼

### **src** folder

-   後端服務器程式碼

### **lib** folder

-   source code library

### **inputs** folder

-   後端服務器產出之輸入給 P 演算法的參數

### **shell** folder

-   簡化 snarkjs 繁瑣的 commands

### **test** folder

-   deviceTreeManager.test.ts 內有多個單元測試，測試過程即為模擬後端服務器收集資料過程，並且產出 inputs 給 P 演算法 (inputs 會儲存於 inputs folder)
-   test 資料夾內的其餘資料夾是用來存放 proof, V 演算法智能合約...等資料
-   要傳給 V 演算法的參數(即 proof)存儲存於 test / circuits / zkREC_v2_test & 樹高 & 可驗證組數 / zkREC_v2_test & proof / 日期 & zkREC_v2_test.soliditycalldata.json
-   V 演算法智能合約 test / circuits / zkREC_v2_test & 樹高 & 可驗證組數 / zkREC_v2_test & sol / zkREC_v2_test_verifier.sol

## 實際執行

---

1. 在 test / circuits 資料夾新增資料夾，命名為 **zkREC_v2_test\_自訂樹高\_自訂可驗證組數**
2. 在新建的資料夾內新增 **zkREC_v2_test.circom**
3. .circom 檔案內複製貼上以下程式碼 (請確保已經安裝 circom 2.1.0 以上的 compiler)

    ```
    pragma circom 2.1.0;

    include "../../../circuits/zkREC_v2/zkREC_v2.circom";

    component main = ZkREC_v2(自訂樹高, 自訂可驗證組數);
    ```

4. 使用 shell / build.sh 處理 G 演算法所需文件
5. 使用 shell / G.sh 進行 G 演算法計算，此過程可能會需要大量運算時間，建議可以降低"可驗證組數"來減少運算時間
6. 透過 deviceTreeManager.test.ts 產生所需要的 inputs
7. 使用 shell / P.sh 將 inputs 傳給 P 演算法生成 proof
8. 使用 shell / V.sh 可以先在鏈下對 proof 進行驗證，先看一下 proof 是否正確，若回傳為 true，則代表 step6. 在 deviceTreeManager.test.ts 中所進行的操作皆通過電路的檢查，並生成一份可供所有人驗證的 proof
