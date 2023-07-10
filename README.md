# zk-recs

論文連結：to be continued...

注意：若要實際執行 G 演算法，需要先至[snarkjs github](https://github.com/iden3/snarkjs/blob/master/README.md#7-prepare-phase-2)下載.ptau 檔案，此電路需要至少下載 ptau 23 的.ptau 檔，下載完成後需要在 zk-recs 目錄下創建一個

## Folders

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
