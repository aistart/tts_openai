# OPENAI TTS API
利用OPENAI最近免费的TTS API开发一个简单实用的文字转语音web页面。填入自己申请的AIP key即可免费播放语音或保存mp3文件。

语音是iphone chatgpt同款，比edge TTS更加流畅自然，特别适合对话场景，有三男三女六个类型可选。

![image](https://github.com/aistart/openai_tts/assets/55378001/05bbc143-619e-4850-81f0-1b537d639690)

# 核心代码
```javasript
    // 音色选择
    const voices = {
        "Onyx 中年男性": "onyx",
        "Nova 女性": "nova",
        "Alloy 青年男性": "alloy",
        "Shimmer 女性": "shimmer",
        "Echo 男性": "echo",
        "Fable 女性": "fable"
    };

    // api调用
    function textToSpeech(YOUR_API_KEY, text, voice, volume, speed, updateUI) {
        const apiUrl = 'https://api.openai.com/v1/audio/speech';
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${YOUR_API_KEY}` // Replace with your actual API key
        };

        const body = JSON.stringify({
            model: "tts-1",
            input: text,
            voice: voice,
            speed: parseFloat(speed)
        });
```
# 使用方法
下载copy放入某个web网站，通过浏览器访问即可，在PC本地双击index.html也可立刻访问。
注意要开通梯子才能访问openai 的api

# 开发建议
整个项目基本上都是用chatgpt生成的代码。具体是利用chatgpt plus大段生成框架和主体代码，辅助使用vscode copilot增强功能和修改bug。

客观说，能用chatgpt plus就用plus，生成的质量是最好的，而且大段大段地根据你的描述生成和改进。不过copy&paste稍麻烦，也有使用次数限制。

# 参考
## vscode copilot 一个月10美金
申请方便，有chat功能。使用时把你项目中相关的几个文件都打开，这样copilot会统一考虑，纳入对你的问题进行分析。

## chatgpt plus
推荐一个共享chatgpt plus账号的平台，已经用了三个月，比较靠谱。10人共享的plus会员不到40元RMB一个月，错开人流高峰，用起来还是相当不错的。
https://nf.video/m1h8h

# 交流
微信号AiBotter，加微信时请备注github。
