function mwToCf7Export() {
  // サイト名を取得
  var siteNameElement = document.querySelector('#wp-admin-bar-site-name > a');
  var siteName = siteNameElement ? siteNameElement.textContent : 'default';
  var postTitleElement = document.querySelector('input[name="post_title"]');
  var postTitle = postTitleElement ? postTitleElement.value : '';
  var fileName = siteName + '_' + postTitle + '_mwToCf7Convert';

  // 各要素の値を取得
  var mailToElement = document.querySelector('input[name="mw-wp-form[mail_to]"]');
  var mailToValue = mailToElement ? mailToElement.value : '';
  var mailCcElement = document.querySelector('input[name="mw-wp-form[mail_cc]"]');
  var mailCcValue = mailCcElement ? mailCcElement.value : '';
  var mailBccElement = document.querySelector('input[name="mw-wp-form[mail_bcc]"]');
  var mailBccValue = mailBccElement ? mailBccElement.value : '';
  var adminMailSubjectElement = document.querySelector('input[name="mw-wp-form[admin_mail_subject]"]');
  var adminMailSubject = adminMailSubjectElement ? adminMailSubjectElement.value : '';
  var adminMailSenderElement = document.querySelector('input[name="mw-wp-form[admin_mail_sender]"]');
  var adminMailSender = adminMailSenderElement ? adminMailSenderElement.value : '';
  var adminMailReplyToElement = document.querySelector('input[name="mw-wp-form[admin_mail_reply_to]"]');
  var adminMailReplyTo = adminMailReplyToElement ? adminMailReplyToElement.value : '';
  var adminMailContentElement = document.querySelector('textarea[name="mw-wp-form[admin_mail_content]"]');
  var adminMailContent = adminMailContentElement ? adminMailContentElement.value : '';
  var mailReturnPathElement = document.querySelector('input[name="mw-wp-form[mail_return_path]"]');
  var mailReturnPath = mailReturnPathElement ? mailReturnPathElement.value : '';
  var adminMailFromElement = document.querySelector('input[name="mw-wp-form[admin_mail_from]"]');
  var adminMailFrom = adminMailFromElement ? adminMailFromElement.value : '';
  var mailSubjectElement = document.querySelector('input[name="mw-wp-form[mail_subject]"]');
  var mailSubject = mailSubjectElement ? mailSubjectElement.value : '';
  var mailSenderElement = document.querySelector('input[name="mw-wp-form[mail_sender]"]');
  var mailSender = mailSenderElement ? mailSenderElement.value : '';
  var mailReplyToElement = document.querySelector('input[name="mw-wp-form[mail_reply_to]"]');
  var mailReplyTo = mailReplyToElement ? mailReplyToElement.value : '';
  var mailContentElement = document.querySelector('textarea[name="mw-wp-form[mail_content]"]');
  var mailContent = mailContentElement ? mailContentElement.value : '';
  var automaticReplyEmailElement = document.querySelector('input[name="mw-wp-form[automatic_reply_email]"]');
  var automaticReplyEmail = automaticReplyEmailElement ? "[" + automaticReplyEmailElement.value + "]" : '';
  var mailFromElement = document.querySelector('input[name="mw-wp-form[mail_from]"]');
  var mailFrom = mailFromElement ? mailFromElement.value : '';
  var completeMessageElement = document.querySelector('textarea[name="mw-wp-form[complete_message]"]');
  var completeMessage = completeMessageElement ? completeMessageElement.value : '';
  var usedbElement = document.querySelector('input[name="mw-wp-form[usedb]"]');
  var usedbValue = usedbElement ? usedbElement.checked : false;

  // MW WP Formの要素を取得
  var mwFormElement = document.querySelector('textarea[name="content"]');

  // MW WP Formの要素からコードを取得
  var mwFormCode = mwFormElement.value;

  // パターンリスト
  var patterns = [
    {
      regex: /\[mwform_(text|tel|email|textarea|select|checkbox|number|radio|zip|datepicker) name="([^"]*)"(.*?)( id="([^"]*)")?(.*?)( class="([^"]*)")?(.*?)( min="([^"]*)")?(.*?)( max="([^"]*)")?(.*?)( step="([^"]*)")?(.*?)( placeholder="([^"]*)")?(.*?)( children="([^"]*?)")?(.*?)\]/,
      process: function (elementDetails) {
        var formType = elementDetails[1];
        var formName = elementDetails[2];
        var formId = elementDetails[5] || '';
        var formClasses = elementDetails[8] ? elementDetails[8].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';
        var formMin = elementDetails[11] ? ' min:' + elementDetails[11] : '';
        var formMax = elementDetails[14] ? ' max:' + elementDetails[14] : '';
        var formPlaceholder = elementDetails[20] || '';
        var formChildren = elementDetails[23] ? elementDetails[23].split(',').map(function (child) {
          var childParts = child.split(':');
          return '"' + (childParts.length > 1 ? childParts[1] : childParts[0]) + '"';
        }).join(' ') : '';

        // MW WP Formの記法をContact Form 7の記法に変換
        var cf7FieldType = formType;
        if (formType === 'zip') {
          cf7FieldType = 'text';
        }
        else if (formType === 'datepicker') {
          cf7FieldType = 'date';
        }
        var cf7FieldCode = '[' + cf7FieldType + ' ' + formName + formMin + formMax + (formId ? ' id:' + formId : '') + (formClasses ? ' ' + formClasses : '') + (formPlaceholder ? ' placeholder "' + formPlaceholder + '"' : '') + (formType === 'checkbox' ? ' use_label_element' : '') + (formChildren ? ' ' + formChildren : '') + ']';

        return cf7FieldCode;
      }
    },
    {
      regex: /\[mwform_(file|image) name="([^"]*)"(.*?)( id="([^"]*)")?(.*?)( class="([^"]*)")?(.*?)( show_error="([^"]*)")?(.*?)\]/,
      process: function (elementDetails) {
        var formType = elementDetails[1];
        var formName = elementDetails[2];
        var formId = elementDetails[5] || '';
        var formClasses = elementDetails[8] ? elementDetails[8].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';

        // MW WP Formの記法をContact Form 7の記法に変換
        var cf7FieldCode = '';
        if (formType === 'file') {
          cf7FieldCode = '[file ' + formName + ' limit:5mb' + (formId ? ' id:' + formId : '') + (formClasses ? ' ' + formClasses : '') + ' filetypes:jpg|png|gif|pdf|docx|xlsx|mp4|mov|avi]';
        } else if (formType === 'image') {
          cf7FieldCode = '[file ' + formName + ' limit:5mb' + ' filetypes:jpg|png|gif]';
        }

        return cf7FieldCode;
      }
    },
    {
      regex: /\[mwform_(bconfirm|bsubmit)(.*?)( name="([^"]*)")?(.*?)( class="([^"]*)")?(.*?)( value="([^"]*)")?(.*?)\](.*?)\[\/mwform_(bconfirm|bsubmit)\]/,
      process: function (elementDetails) {
        var formClasses = elementDetails[7] ? elementDetails[7].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';

        // MW WP Formの記法をContact Form 7の記法に変換
        var cf7FieldCode = '[submit ' + formClasses + ' "送信"]';

        return cf7FieldCode;
      }
    },
    {
      regex: /\[mwform_(confirmButton|submitButton|submit|bconfirm|bsubmit)(.*?)( name="([^"]*)")?(.*?)( class="([^"]*)")?(.*?)( value="([^"]*)")?(.*?)\]/,
      process: function (elementDetails) {
        var formClasses = elementDetails[7] ? elementDetails[7].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';

        // MW WP Formの記法を指定された記法に変換
        var newFieldCode = '[submit ' + formClasses + ' "送信"]';

        return newFieldCode;
      }
    }
  ];

  // 各パターンに対して処理を行う
  var convertedCode = mwFormCode;
  patterns.forEach(function (pattern) {
    var patternGlobal = new RegExp(pattern.regex.source, 'g');
    var mwFormMatches = mwFormCode.match(patternGlobal);

    // 抽出した要素が存在する場合の処理
    if (mwFormMatches) {

      // 各要素に対して処理を行う
      mwFormMatches.forEach(function (match) {
        var elementDetails = match.match(pattern.regex);
        var newFieldCode = pattern.process(elementDetails);

        // 変換した記法を元のコードに適用
        convertedCode = convertedCode.replace(match, newFieldCode);
      });
    }
  });


  // reCAPTCHA要素を削除
  convertedCode = convertedCode.replace(/\[(mwform_hidden|mwform_error) .*\]\n/g, '');

  // 各値と変換したコードをJSON形式で保存
  function replaceBracketsInString(str) {
    return str.replace(/{/g, '[').replace(/}/g, ']');
  }

  function replaceBracketsInObject(obj) {
    return Object.entries(obj).reduce((newObj, [key, value]) => {
      newObj[key] = replaceBracketsInString(value);
      return newObj;
    }, {});
  }

  var convertedData = [
    {
      'formContent': {
        'postTitle': postTitle,
        'convertedCode': convertedCode,
      }
    },
    {
      'adminMail': replaceBracketsInObject({
        'mailToValue': mailToValue,
        'mailCcValue': mailCcValue,
        'mailBccValue': mailBccValue,
        'adminMailSubject': adminMailSubject,
        'adminMailSender': adminMailSender,
        'adminMailReplyTo': adminMailReplyTo,
        'adminMailContent': adminMailContent,
        'mailReturnPath': mailReturnPath,
        'adminMailFrom': adminMailFrom,
      })
    },
    {
      'mail': replaceBracketsInObject({
        'mailSubject': mailSubject,
        'mailSender': mailSender,
        'mailReplyTo': mailReplyTo,
        'mailContent': mailContent,
        'automaticReplyEmail': automaticReplyEmail,
        'mailFrom': mailFrom,
      })
    },
    {
      'otherSettings': {
        'completeMessage': completeMessage,
        'usedbValue': usedbValue
      }
    }
  ];


  // JSON形式のデータをBlob形式に変換
  var dataBlob = new Blob([JSON.stringify(convertedData, null, '    ')], { type: 'application/json' });

  // Blob形式のデータをダウンロード可能なURLに変換
  var downloadUrl = URL.createObjectURL(dataBlob);

  // ダウンロードリンクを作成し、クリックイベントを発火させてダウンロード
  var downloadLinkElement = document.createElement('a');
  downloadLinkElement.download = fileName + '.json';
  downloadLinkElement.href = downloadUrl;
  downloadLinkElement.click();

  // ダウンロード後、URLを解放
  URL.revokeObjectURL(downloadUrl);
}
mwToCf7Export();
