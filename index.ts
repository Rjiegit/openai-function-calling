import 'dotenv/config';
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openAiApi = new OpenAIApi(configuration);

function getCurrentWeather(location: string) {
  return {
    "location": location,
    "temperature": "72",
    "forecast": ["sunny", "windy"],
  }
}

async function main() {
  const completion = await openAiApi.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful a assistant.',
      },
      {
        role: 'user',
        content: 'what is the current weather in Taipei?',
      }
    ],
    function_call: 'auto',
    // Step 1: send the conversation and available functions to GPT
    // 自己定義要執行的 function，OpenAI 可以根據問題自行決定呼叫的 function
    functions: [{
      name: 'getCurrentWeather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location, e.g. "Taipei"'
          }
        },
        required: ['location']
      }
    }],
  });

  const completionResponse = completion.data.choices[0].message!;

  console.log(completionResponse);
  /**
   *
   * {
   *   role: 'assistant',
   *   content: null,
   *   function_call: { name: 'getCurrentWeather', arguments: '{\n"location": "Taipei"\n}' }
   * }
   *
   */

    // Step 2: check if GPT wanted to call a function
    // 如果 content 為 null，則表示 OpenAI 認爲需要執行自定義的 function 內容，會列出可執行的 function name，可以根據需求進行處理

  let functionCallResult = '';
  if (!completionResponse.content && completionResponse.function_call) {
    if (completionResponse.function_call.name === 'getCurrentWeather') {
      const args = JSON.parse(completionResponse.function_call.arguments!);
      // Step 3: call the function
      // 執行自定義的 function
      functionCallResult = JSON.stringify(getCurrentWeather(args.location));
    }

    // Step 4: send the info on the function call and function response to GPT
    // 將 function 執行結果回傳給 OpenAI，讓 OpenAI 繼續處理

    const completionResponse2 = await openAiApi.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful a assistant.',
        },
        {
          role: 'user',
          content: 'what is the current weather in Taipei?',
        },
        {
          role: 'function',
          name: 'getCurrentWeather',
          content: functionCallResult
        }
      ]
    });

    // Step 5: get the response from GPT
    // 取得 OpenAI 回傳的結果，會結合 function 執行的結果進行處理
    console.log('completion2');
    console.log(completionResponse2.data.choices[0].message);
  }

}

main();