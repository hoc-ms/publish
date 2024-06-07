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
  var automaticReplyEmail = automaticReplyEmailElement ? "{" + automaticReplyEmailElement.value + "}" : '';
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

  // Validations配列を作成
  var validations = [];
  var i = 0;
  while (true) {
    var targetElement = document.querySelector('input[name="mw-wp-form[validation][' + i + '][target]"]');
    var noemptyElement = document.querySelector('input[name="mw-wp-form[validation][' + i + '][noempty]"]');
    var requiredElement = document.querySelector('input[name="mw-wp-form[validation][' + i + '][required]"]');
    if (!targetElement) break;
    validations.push({
      target: targetElement.value,
      noempty: noemptyElement ? noemptyElement.checked : false,
      required: requiredElement ? requiredElement.checked : false
    });
    i++;
  }

  // パターンリスト
  var patterns = [
    {
      regex: /\[mwform_(textarea|tel|url|email|text|select|checkbox|number|radio|zip|datepicker)([\n\s\S]*?)(\s*name="([^"]*)")?([\n\s\S]*?)(\s*id="([^"]*)")?([\n\s\S]*?)(\s*class="([^"]*)")?([\n\s\S]*?)(\s*min="([^"]*)")?([\n\s\S]*?)(\s*max="([^"]*)")?([\n\s\S]*?)(\s*step="([^"]*)")?([\n\s\S]*?)(\s*placeholder="([^"]*)")?([\n\s\S]*?)(\s*children="([^"]*?)")?([\n\s\S]*?)\]/,
      process: function (elementDetails) {
        var formType = elementDetails[1];
        var formName = elementDetails[4] || '';
        var formId = elementDetails[7] || '';
        var formClasses = elementDetails[10] ? elementDetails[10].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';
        var formMin = elementDetails[13] ? ' min:' + elementDetails[13] : '';
        var formMax = elementDetails[16] ? ' max:' + elementDetails[16] : '';
        var formPlaceholder = elementDetails[22] || '';
        var formChildren = elementDetails[25] ? elementDetails[25].split(',').map(function (child) {
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
        var cf7FieldCode = '[' + cf7FieldType + ' ' + formName + formMin + formMax + (formId ? ' id:' + formId : '') + (formClasses ? ' ' + formClasses : '') + (formPlaceholder ? ' placeholder "' + formPlaceholder + '"' : '') + (['checkbox', 'radio'].includes(formType) ? ' use_label_element' : '') + (formChildren ? ' ' + formChildren : '') + ']';

        // Validations配列をチェックし、必要なら'*'を追加
        for (var i = 0; i < validations.length; i++) {
          if (validations[i].target === formName && (validations[i].noempty || validations[i].required)) {
            var cf7FieldTypeSuffix = cf7FieldType === 'radio' ? ' ' : '* ';
            cf7FieldCode = '[' + cf7FieldType + cf7FieldTypeSuffix + formName + (formId ? ' id:' + formId : '') + (formClasses ? ' ' + formClasses : '') + (formPlaceholder ? ' placeholder "' + formPlaceholder + '"' : '') + (formChildren ? ' ' + formChildren : '') + ']';
            break;
          }
        }

        return cf7FieldCode;
      }
    },
    {
      regex: /\[mwform_(file|image)([\n\s\S]*?)(\s*name="([^"]*)")([\n\s\S]*?)(\s*id="([^"]*)")?([\n\s\S]*?)(\s*class="([^"]*)")?([\n\s\S]*?)(\s*show_error="([^"]*)")?([\n\s\S]*?)\]/,
      process: function (elementDetails) {
        var formType = elementDetails[1];
        var formName = elementDetails[4] || '';
        var formId = elementDetails[7] || '';
        var formClasses = elementDetails[10] ? elementDetails[10].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';

        // MW WP Formの記法をContact Form 7の記法に変換
        var cf7FieldCode = '';
        if (formType === 'file') {
          cf7FieldCode = '[file ' + formName + ' limit:5mb' + (formId ? ' id:' + formId : '') + (formClasses ? ' ' + formClasses : '') + ' filetypes:jpg|png|gif|pdf|docx|xlsx|mp4|mov|avi]';
        } else if (formType === 'image') {
          cf7FieldCode = '[file ' + formName + ' limit:5mb' + ' filetypes:jpg|png|gif]';
        }

        // Validations配列をチェックし、必要なら'*'を追加
        for (var i = 0; i < validations.length; i++) {
          if (validations[i].target === formName && (validations[i].noempty || validations[i].required)) {
            cf7FieldCode = '[' + cf7FieldType + '* ' + formName + (formId ? ' id:' + formId : '') + (formClasses ? ' ' + formClasses : '') + (formPlaceholder ? ' placeholder "' + formPlaceholder + '"' : '') + (formChildren ? ' ' + formChildren : '') + ']';
            break;
          }
        }

        return cf7FieldCode;
      }
    },
    {
      regex: /\[mwform_(bconfirm|bsubmit)([\n\s\S]*?)(\s*name="([^"]*)")?([\n\s\S]*?)(\s*class="([^"]*)")?([\n\s\S]*?)(\s*value="([^"]*)")?([\n\s\S]*?)\]([\n\s\S]*?)\[\/mwform_(bconfirm|bsubmit)\]/,
      process: function (elementDetails) {
        var formClasses = elementDetails[7] ? elementDetails[7].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';

        // MW WP Formの記法をContact Form 7の記法に変換
        var cf7FieldCode = '[submit' + (formClasses || '') + ' "送信"]';

        return cf7FieldCode;
      }
    },
    {
      regex: /\[mwform_(confirmButton|submitButton|submit|bconfirm|bsubmit)([\n\s\S]*?)(\s*name="([^"]*)")?([\n\s\S]*?)(\s*class="([^"]*)")?([\n\s\S]*?)(\s*value="([^"]*)")?([\n\s\S]*?)\]/,
      process: function (elementDetails) {
        var formClasses = elementDetails[7] ? elementDetails[7].split(' ').map(function (className) { return 'class:' + className; }).join(' ') : '';

        // MW WP Formの記法をContact Form 7の記法に変換
        var newFieldCode = '[submit' + (formClasses ? ' ' + formClasses : '') + ' "送信"]';

        return newFieldCode;
      }
    }
  ];

  // 各パターンに対して処理を行う
  var convertedCode = mwFormCode;
  patterns.forEach(function (pattern) {
    var patternGlobal = new RegExp(pattern.regex.source, 'gs');
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
  convertedCode = convertedCode.replace(/\[(mwform_hidden|mwform_error) [\s\S]*?\]/g, '');

  // 各値と変換したコードをJSON形式で保存
  function replaceBracketsInString(str) {
    return str.replace(/{/g, '[').replace(/}/g, ']');
  }

  // 日本語を検出する関数
  function isJapanese(text) {
    var japaneseRegex = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\u3041-\u3096\u30A0-\u30FF\uFF66-\uFF9F\u4E00-\u9FAF]/u;
    return japaneseRegex.test(text);
  }

  // 日本語とIDの対応を保持するマップ
  const japaneseToIdMap = new Map();
  const japaneseToFormTypeMap = new Map();

  // 一意の英数字を生成する関数
  function generateUniqueId() {
    return Math.random().toString(36).substring(2, 6);
  }

  // 日本語部分を一意の英数字に置換する関数
  function replaceJapaneseInBrackets(str) {
    return str.replace(/(\[[^\]]*?\])|(\{[^}]*?\})/g, function (match, p1, p2) {
      var target = p1 || p2;
      var bracketType = p1 ? 'square' : 'curly';
      var textToCheck = target.slice(1, -1);

      if (bracketType === 'square') {
        var parts = textToCheck.split(' ');
        if (parts.length > 1) {
          var firstSpaceIndex = textToCheck.indexOf(' ');
          var beforeFirstSpace = textToCheck.slice(0, firstSpaceIndex);
          var afterFirstSpace = textToCheck.slice(firstSpaceIndex + 1);

          var secondSpaceIndex = afterFirstSpace.indexOf(' ');
          var endIndex = secondSpaceIndex !== -1 ? secondSpaceIndex : afterFirstSpace.length;

          var japanesePart = afterFirstSpace.slice(0, endIndex);
          var remainingPart = afterFirstSpace.slice(endIndex);

          if (isJapanese(japanesePart)) {
            var formType = beforeFirstSpace.replace('*', '');
            if (!japaneseToFormTypeMap.has(japanesePart)) {
              japaneseToFormTypeMap.set(japanesePart, formType);
            }
            var formTypePrefix = japaneseToFormTypeMap.get(japanesePart) + '_';
            if (!japaneseToIdMap.has(japanesePart)) {
              japaneseToIdMap.set(japanesePart, formTypePrefix + generateUniqueId());
            }
            return `[${beforeFirstSpace} ${japaneseToIdMap.get(japanesePart)}${remainingPart}]`;
          }
        }
      } else if (bracketType === 'curly') {
        if (isJapanese(textToCheck)) {
          if (japaneseToFormTypeMap.has(textToCheck)) {
            var formTypePrefix = japaneseToFormTypeMap.get(textToCheck) + '_';
            if (!japaneseToIdMap.has(textToCheck)) {
              japaneseToIdMap.set(textToCheck, formTypePrefix + generateUniqueId());
            }
          } else {
            if (!japaneseToIdMap.has(textToCheck)) {
              japaneseToIdMap.set(textToCheck, generateUniqueId());
            }
          }
          return `{${japaneseToIdMap.get(textToCheck)}}`;
        }
      }
      return match;
    });
  }

  // オブジェクトの各キーと値を走査し、値が文字列であればreplaceJapaneseInBrackets関数を適用し、値がオブジェクトであれば再帰的にreplaceBracketsInObject関数を適用する関数
  function replaceBracketsInObject(obj) {
    return Object.entries(obj).reduce((newObj, [key, value]) => {
      if (typeof value === 'string') {
        // まず日本語部分を置換
        value = replaceJapaneseInBrackets(value);
        // 次にブレースを角括弧に置換
        newObj[key] = replaceBracketsInString(value);
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = replaceBracketsInObject(value);
      } else {
        newObj[key] = value;
      }
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
      'adminMail': {
        'mailToValue': mailToValue,
        'mailCcValue': mailCcValue,
        'mailBccValue': mailBccValue,
        'adminMailSubject': adminMailSubject,
        'adminMailSender': adminMailSender,
        'adminMailReplyTo': adminMailReplyTo,
        'adminMailContent': adminMailContent,
        'mailReturnPath': mailReturnPath,
        'adminMailFrom': adminMailFrom,
      }
    },
    {
      'mail': {
        'mailSubject': mailSubject,
        'mailSender': mailSender,
        'mailReplyTo': mailReplyTo,
        'mailContent': mailContent,
        'automaticReplyEmail': automaticReplyEmail,
        'mailFrom': mailFrom,
      }
    },
    {
      'otherSettings': {
        'completeMessage': completeMessage,
        'usedbValue': usedbValue
      }
    }
  ];

  // convertedDataの各要素に対してreplaceBracketsInObject関数を適用
  convertedData = convertedData.map(replaceBracketsInObject);

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
