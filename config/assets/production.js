'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-bootstrap-datetimepicker/datetimepicker.css',
        'public/lib/angular-ui-select/dist/select.css',
        'public/lib/ng-table/dist/ng-table.min.css',
        'public/lib/angular-bootstrap-colorpicker/css/colorpicker.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-i18n/angular-locale_es-cr.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-ui-bootstrap-datetimepicker/datetimepicker.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/angular-file-saver/dist/angular-file-saver.bundle.js',
        'public/lib/angular-ui-mask/dist/mask.js',
        'public/lib/lodash/lodash.js',
        'public/lib/angular-ui-select/dist/select.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/ngMask/dist/ngMask.min.js',
        'public/lib/ng-table/dist/ng-table.min.js',
        'public/lib/ng-table-to-csv/dist/ng-table-to-csv.js',
        'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
        'public/lib/angular-moment/angular-moment.js'
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};