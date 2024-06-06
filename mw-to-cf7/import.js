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
                // フォーム
                'formContent.postTitle': 'input[name="post_title"]',
                'formContent.convertedCode': 'textarea[name="wpcf7-form"]',
                // メール(1)
                'adminMail.mailToValue': 'input[name="wpcf7-mail[recipient]"]',
                'adminMail.adminMailSubject': 'input[name="wpcf7-mail[subject]"]',
                'adminMail.adminMailContent': 'textarea[name="wpcf7-mail[body]"]',
                // メール(2)
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
            let mail2Checkbox = document.querySelector('input[name="wpcf7-mail-2[active]"]');
            if (mail2Checkbox && !mail2Checkbox.checked) {
                mail2Checkbox.click();
            }

            // 編集が必要な文字列を処理してから入力
            // メール(1)
            if (item.adminMail) {
                // 送信元
                let mail1SenderInput = document.querySelector('input[name="wpcf7-mail[sender]"]');
                if (mail1SenderInput) {
                    let adminMailSender = item.adminMail.adminMailSender || '[_site_title]';
                    let adminMailFrom = item.adminMail.adminMailFrom || 'contact@' + window.location.hostname;
                    mail1SenderInput.value = `${adminMailSender} <${adminMailFrom}>`;
                }
                // 追加ヘッダー
                let mail1AdditionalHeaders = document.querySelector('textarea[name="wpcf7-mail[additional_headers]"]');
                if (mail1AdditionalHeaders) {
                    let adminMailReplyTo = item.adminMail.adminMailReplyTo || item.mail.automaticReplyEmail;
                    let mailCcValue = item.adminMail.mailCcValue || "";
                    let mailBccValue = item.adminMail.mailBccValue || "";
                    mail1AdditionalHeaders.value = adminMailReplyTo ? `Reply-To: ${adminMailReplyTo}` : '';
                    if (mailCcValue) {
                        mail1AdditionalHeaders.value += `\nCc: ${mailCcValue}`;
                    }
                    if (mailBccValue) {
                        mail1AdditionalHeaders.value += `\nBcc: ${mailBccValue}`;
                    }
                }
            }

            // メール(2)
            if (item.mail) {
                // 送信元
                let mail2SenderInput = document.querySelector('input[name="wpcf7-mail-2[sender]"]');
                if (mail2SenderInput) {
                    let senderName = item.mail.mailSender || '[_site_title]';
                    let senderEmail = item.mail.mailFrom || 'contact@' + window.location.hostname;
                    mail2SenderInput.value = `${senderName} <${senderEmail}>`;
                }
                // 追加ヘッダー
                let mail2AdditionalHeaders = document.querySelector('textarea[name="wpcf7-mail-2[additional_headers]"]');
                if (mail2AdditionalHeaders) {
                    let mailReplyTo = item.mail.mailReplyTo || "";
                    mail2AdditionalHeaders.value = mailReplyTo ? `Reply-To: ${mailReplyTo}` : '';
                }
            }
        };
        // ファイルの内容をテキストとして読み込む
        fileReader.readAsText(event.target.files[0]);
    };
}

// 関数を実行
MwToCf7Import();
