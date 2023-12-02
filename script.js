// Place your OpenAI API key here
let YOUR_API_KEY = 'sk-****';//填入自己申请的chatgpt key

let audioContext;
let audioBuffer = null;

document.addEventListener('DOMContentLoaded', (event) => {

    var settingsButton = document.getElementById("settings-button");
    var settingsPanel = document.getElementById("settings-panel");
    var controlsPanel = document.getElementById("controls-panel");

    

    settingsButton.onclick = function () {
        if (settingsPanel.style.display === "block") {
            settingsPanel.style.display = "none";
            controlsPanel.style.display = "none";
        } else {
            settingsPanel.style.display = "block";
            controlsPanel.style.display = "block";
        }
    }

    var fileLabel = document.getElementById("file-label");
    var fileInput = document.getElementById("file-input");

    fileLabel.onclick = function () {
        fileInput.click();
    }

    const openaiApiKey = document.getElementById("openai-api-key");
    const info = document.getElementById('info');
    const readButton = document.getElementById('read-button');
    const textArea = document.getElementById('text-to-speak');
    const volumeControl = document.getElementById('volume-control');
    const speedControl = document.getElementById('speed-control');
    const voiceSelect = document.getElementById('voice-select');
    const voices = {
        "Onyx 中年男性": "onyx",
        "Nova 女性": "nova",
        "Alloy 青年男性": "alloy",
        "Shimmer 女性": "shimmer",
        "Echo 男性": "echo",
        "Fable 女性": "fable"
    };
    
    Object.keys(voices).forEach(alias => {
        let option = document.createElement('option');
        option.value = voices[alias];
        option.textContent = alias;
        voiceSelect.appendChild(option);
    });

    let audioContext;
    let rawAudioData; // This will hold the raw ArrayBuffer from the fetch call

    const playButton = document.getElementById('play-button');
    const saveButton = document.getElementById('save-button');
    let audioBuffer = null;

    readButton.addEventListener('click', function () {
        const YOUR_API_KEY = openaiApiKey.value;
        const text = textArea.value.trim();
        const voice = voiceSelect.value;
        const volume = volumeControl.value;
        const speed = speedControl.value;
        // Start or resume the audio context on user gesture
        if (!audioContext) {
            audioContext = new AudioContext();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (!text) {
            alert('请输入要朗读的文本。');
            return;
        }

        if (!YOUR_API_KEY) {
            alert('请在设置中输入您的openai api key');
            return;
        }

        updateUI('processing');
        textToSpeech(YOUR_API_KEY, text, voice, volume, speed, updateUI);
    });

    playButton.addEventListener('click', function () {
        if (audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
        }
    });

    saveButton.addEventListener('click', function () {
        if (rawAudioData) {
            const timestamp = new Date().getTime();
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(rawAudioData);
            downloadLink.download = `${timestamp}.mp3`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    });


    function updateUI(state) {
        const readButton = document.getElementById('read-button');
        const playButton = document.getElementById('play-button');
        const saveButton = document.getElementById('save-button');
        switch (state) {
            case 'processing':
                readButton.textContent = '生成中...';
                readButton.disabled = true;
                playButton.style.display = 'none';
                saveButton.style.display = 'none';
                break;
            case 'decoded':
                playButton.textContent = '播放';
                saveButton.textContent = '保存';
                playButton.style.display = 'inline-block';
                saveButton.style.display = 'inline-block';
                readButton.style.display = 'none';
                playButton.disabled = false;
                saveButton.disabled = false;
                break;
            // You can add more cases if needed
        }
    };

    // Function to handle text input changes
    function handleTextInput() {
        resetUI()   
    // 使用正则表达式匹配汉字、数字和英文字符
    let characters = textArea.value.match(/[\u4e00-\u9fa5A-Za-z0-9]/g) || [];
    let characterCount = characters.length;
        if (characterCount > 0) {
            let estimatedTime = characterCount / 10 + 2; // 假设每个字符需要2秒来生成语音
            info.textContent = `总字符数: ${characterCount}, 预估生成时间: ${estimatedTime} 秒`;   
        }
    }
    textArea.addEventListener('input', handleTextInput);

    // Function to handle file uploads and read text
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                textArea.value = e.target.result;
                handleTextInput();
            };
            reader.readAsText(file); // Assuming text file, you need additional logic for Word files
        }
    }
    document.getElementById('file-input').addEventListener('change', handleFileUpload);



    // Call this function whenever the text is modified
    function resetUI() {
        playButton.style.display = 'none';
        saveButton.style.display = 'none';
        readButton.style.display = 'inline-block';
        readButton.disabled = false;
        readButton.textContent = '生成语音';
    }


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

        fetch(apiUrl, { method: 'POST', headers: headers, body: body })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Get the response as a blob directly since it should be an MP3 file
                return response.blob();
            })
            .then(blob => {
                // Store the blob for downloading
                rawAudioData = blob;
                // Convert the blob to an ArrayBuffer for decoding
                return blob.arrayBuffer();
            })
            .then(arrayBuffer => {
                // Decode the ArrayBuffer for playing
                return audioContext.decodeAudioData(arrayBuffer);
            })
            .then(decodedBuffer => {
                audioBuffer = decodedBuffer;
                updateUI('decoded');
            })
            .catch(error => {
                console.error('Error during fetch:', error);
                updateUI('error');
            });
    }

});



