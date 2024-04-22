function MwToCf7Import() {
  // ファイル選択ウィンドウを開く
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json'; // デフォルトの形式はjsonファイル
  fileInput.click();

  fileInput.onchange = function(event) {
      let fileReader = new FileReader();
      fileReader.onload = function() {
          let data = JSON.parse(this.result);

          // データの各要素をループ処理
          for (let i = 0; i < data.length; i++) {
              let item = data[i];

              // 'postTitle'の値を'input[name="post_title"]'に挿入
              if (item.formContent && item.formContent.postTitle) {
                  let postTitleInput = document.querySelector('input[name="post_title"]');
                  if (postTitleInput) {
                      postTitleInput.value = item.formContent.postTitle;
                  }
              }

              // 'convertedCode'の値を'textarea[name="wpcf7-form"]'に挿入
              if (item.formContent && item.formContent.convertedCode) {
                  let formTextarea = document.querySelector('textarea[name="wpcf7-form"]');
                  if (formTextarea) {
                      formTextarea.value = item.formContent.convertedCode;
                  }
              }

              // 'mailToValue'の値を'input[name="wpcf7-mail[recipient]"]'に挿入
              if (item.adminMail && item.adminMail.mailToValue) {
                  let mailToValueInput = document.querySelector('input[name="wpcf7-mail[recipient]"]');
                  if (mailToValueInput) {
                      mailToValueInput.value = item.adminMail.mailToValue;
                  }
              }

              // 'adminMailSubject'の値を'input[name="wpcf7-mail[subject]"]'に挿入
              if (item.adminMail && item.adminMail.adminMailSubject) {
                  let adminMailSubjectInput = document.querySelector('input[name="wpcf7-mail[subject]"]');
                  if (adminMailSubjectInput) {
                      adminMailSubjectInput.value = item.adminMail.adminMailSubject;
                  }
              }

              // 'adminMailContent'の値を'textarea[name="wpcf7-mail[body]"]'に挿入
              if (item.adminMail && item.adminMail.adminMailContent) {
                  let adminMailContentTextarea = document.querySelector('textarea[name="wpcf7-mail[body]"]');
                  if (adminMailContentTextarea) {
                      adminMailContentTextarea.value = item.adminMail.adminMailContent;
                  }
              }

              // 'mailSubject'の値を'input[name="wpcf7-mail-2[recipient]"]'に挿入
              if (item.adminMail && item.adminMail.mailSubject) {
                  let mailSubjectInput = document.querySelector('input[name="wpcf7-mail-2[recipient]"]');
                  if (mailSubjectInput) {
                      mailSubjectInput.value = item.adminMail.mailSubject;
                  }
              }

          }
      };
      fileReader.readAsText(event.target.files[0]);
  };
}
