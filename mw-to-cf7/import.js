function MwToCf7Import() {
    // ファイル選択ウィンドウを作成
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.click();

    fileInput.onchange = function (event) {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            // ファイルの内容をJSONとして解析
            let data = JSON.parse(this.result);

            // データをオブジェクトに変換
            let item = Object.assign({}, ...data);

            // フィールドとセレクタのマッピングを定義
            const fields = {
                'formContent.postTitle': 'input[name="post_title"]',
                'formContent.convertedCode': 'textarea[name="wpcf7-form"]',
                'adminMail.mailToValue': 'input[name="wpcf7-mail[recipient]"]',
                'adminMail.adminMailSubject': 'input[name="wpcf7-mail[subject]"]',
                'adminMail.adminMailContent': 'textarea[name="wpcf7-mail[body]"]',
                'mail.automaticReplyEmail': 'input[name="wpcf7-mail-2[recipient]"]',
                'mail.mailSubject': 'input[name="wpcf7-mail-2[subject]"]',
                'mail.mailContent': 'textarea[name="wpcf7-mail-2[body]"]',
            };

            // 各フィールドに対して処理を行う
            Object.keys(fields).forEach(field => {
                // フィールド名をドットで分割し、各部分を取得
                let keys = field.split('.');
                let value = item;
                // 各キーに対して値を取得
                keys.forEach(key => {
                    value = value ? value[key] : null;
                });
                // 値が存在する場合、対応する要素に値を設定
                if (value) {
                    let input = document.querySelector(fields[field]);
                    if (input) {
                        input.value = value;
                    }
                }
            });

            // 添付ファイルを反映
            let filePatternMatches = item.formContent.convertedCode.match(/\[file\s([^\s]+)[^\]]*\]/g);
            if (filePatternMatches) {
                let fileNamesArray = filePatternMatches.map(match => match.split(' ')[1]);
                let concatenatedFileNames = fileNamesArray.map(fileName => `[${fileName}]`).join(' ');
                document.querySelector('textarea[name="wpcf7-mail[attachments]"]').value = concatenatedFileNames;
            }

            // メール(2)を有効化
            let activeCheckbox = document.querySelector('input[name="wpcf7-mail-2[active]"]');
            if (activeCheckbox && !activeCheckbox.checked) {
                activeCheckbox.click();
            }

            // 編集が必要な文字列を処理
            if (item.adminMail) {
                let adminMailSender = document.querySelector('input[name="wpcf7-mail[sender]"]');
                if (adminMailSender) {
                    adminMailSender.value = item.adminMail.adminMailSender + ' <' + item.adminMail.adminMailFrom + '>';
                }
            }

            if (item.mail) {
                let mailSender = document.querySelector('input[name="wpcf7-mail-2[sender]"]');
                if (mailSender) {
                    mailSender.value = item.mail.mailSender + ' <' + item.mail.mailFrom + '>';
                }
            }
        };
        // ファイルの内容をテキストとして読み込む
        fileReader.readAsText(event.target.files[0]);
    };
}

// 関数を実行
MwToCf7Import();
