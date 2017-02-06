'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/angular-ui-bootstrap-datetimepicker/datetimepicker.css',
        'public/lib/angular-ui-select/dist/select.min.css',
        'public/lib/ng-table/dist/ng-table.min.css',
        'public/lib/angular-bootstrap-colorpicker/css/colorpicker.min.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/angular-i18n/angular-locale_es-cr.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-ui-bootstrap-datetimepicker/datetimepicker.js',
        'public/lib/moment/moment.js',
        'public/lib/blob-polyfill/Blob.js',
        'public/lib/file-saver.js/FileSaver.js',
        'public/lib/angular-file-saver/dist/angular-file-saver.bundle.min.js',
        'public/lib/angular-ui-mask/dist/mask.min.js',
        'public/lib/lodash/lodash.js',
        'public/lib/angular-ui-select/dist/select.min.js',
        'public/lib/ngMask/dist/ngMask.min.js',
        'public/lib/ng-table/dist/ng-table.min.js',
        'public/lib/jzip/jzip.js',
        'public/lib/xlsx-js/xlsx.js',
        'public/lib/file-saverjs/FileSaver.min.js',
        'public/lib/blobjs/Blob.min.js',
        'public/lib/tableexport.js/dist/js/tableexport.js',
        'public/lib/ng-table-to-csv/dist/ng-table-to-csv.min.js',
        'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js',
        'public/lib/angular-moment/angular-moment.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};