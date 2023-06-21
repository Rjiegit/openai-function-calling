# OpenAI function calling example code

## Description
這是一個使用 OpenAI 的 GPT-3 模型與 function calling 的範例程式碼。
程式中使用了 openai 套件來與 OpenAI 的 Model 進行互動，當 OpenAI 回應中有自定義函式的呼叫時，程式會執行該 function 並回傳結果。
內含一個 getCurrentWeather function 用來獲取特定城市的天氣資訊。

## Setup
1. 下載 .env.example 檔案，並更名為 .env。
2. 從 OpenAI 網站獲取 API Key，並將其加到 .env 文件中的 OPENAI_API_KEY 欄位。
3. 安裝套件並執行
```
yarn install
yarn start
```