function MwToCf7Import() {
    // ファイル選択ウィンドウを開く
    let inputElement = document.createElement('input');
    inputElement.type = "file";
    inputElement.accept = ".json"; // デフォルトの形式はjsonファイル
    inputElement.click();

    inputElement.onchange = function(event) {
        let fileReader = new FileReader();
        fileReader.onload = function() {
            let data = JSON.parse(this.result);

            // "convertedCode"の値を"textarea[name='wpcf7-form']"に挿入
            let textareaElement = document.querySelector('textarea[name="wpcf7-form"]');
            if (textareaElement && data.convertedCode) {
                textareaElement.value = data.convertedCode;
            }

            // "mailToValue"の値を"input[name='wpcf7-mail[recipient]']"に挿入
            let inputElement = document.querySelector('input[name="wpcf7-mail[recipient]"]');
            if (inputElement && data.mailToValue) {
                inputElement.value = data.mailToValue;
            }
        };
        fileReader.readAsText(event.target.files[0]);
    };
}

