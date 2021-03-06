QUnit.module('Validate SimpleForm Bootstrap 5', {
  before: function () {
    currentFormBuilder = window.ClientSideValidations.formBuilders['SimpleForm::FormBuilder']
    window.ClientSideValidations.formBuilders['SimpleForm::FormBuilder'] = BS4_FORM_BUILDER
  },

  after: function () {
    window.ClientSideValidations.formBuilders['SimpleForm::FormBuilder'] = currentFormBuilder
  },

  beforeEach: function () {
    dataCsv = {
      html_settings: {
        type: 'SimpleForm::FormBuilder',
        error_class: null,
        error_tag: 'div',
        wrapper_error_class: 'form-group-invalid',
        wrapper_tag: 'div',
        wrapper_class: 'mb-3'
      },
      validators: {
        'user[name]': { presence: [{ message: 'must be present' }], format: [{ message: 'is invalid', 'with': { options: 'g', source: '\\d+' } }] },
        'user[username]': { presence: [{ message: 'must be present' }] },
        'user[password]': { presence: [{ message: 'must be present' }] }
      }
    }

    $('#qunit-fixture')
      .append(
        $('<form>', {
          action: '/users',
          'data-client-side-validations': JSON.stringify(dataCsv),
          method: 'post',
          id: 'new_user'
        })
          .append(
            $('<div>', { 'class': 'mb-3' })
              .append(
                $('<label for="user_name" class="string form-label">Name</label>'))
              .append(
                $('<input />', { 'class': 'form-control', name: 'user[name]', id: 'user_name', type: 'text' })))
          .append(
            $('<div>', { 'class': 'mb-3' })
              .append(
                $('<label for="user_password" class="string form-label">Password</label>'))
              .append(
                $('<input />', { 'class': 'form-control', name: 'user[password]', id: 'user_password', type: 'password' }))
              .append(
                $('<div />', { 'class': 'form-text', text: 'Minimum 8 characters' })))
          .append(
            $('<div>', { 'class': 'mb-3' })
              .append(
                $('<label for="user_username" class="string form-label">Username</label>'))
              .append(
                $('<div>', { 'class': 'input-group' })
                  .append(
                    $('<span>', { 'class': 'input-group-text', text: '@' }))
                  .append(
                    $('<input />', { 'class': 'form-control', name: 'user[username]', id: 'user_username', type: 'text' })))))

    $('form#new_user').validate()
  }
})

var wrappers = ['horizontal_form', 'vertical_form', 'inline_form']

for (var i = 0; i < wrappers.length; i++) {
  var wrapper = wrappers[i]

  QUnit.test(wrapper + ' - Validate error attaching and detaching', function (assert) {
    var form = $('form#new_user')
    var input = form.find('input#user_name')
    var label = $('label[for="user_name"]')
    form[0].ClientSideValidations.settings.html_settings.wrapper = wrapper

    input.trigger('focusout')
    assert.ok(input.parent().hasClass('form-group-invalid'))
    assert.ok(label.parent().hasClass('form-group-invalid'))
    assert.ok(input.parent().find('div.invalid-feedback:contains("must be present")')[0])

    input.val('abc')
    input.trigger('change')
    input.trigger('focusout')
    assert.ok(input.parent().hasClass('form-group-invalid'))
    assert.ok(input.parent().find('div.invalid-feedback:contains("is invalid")')[0])
    assert.ok(input.hasClass('is-invalid'))

    input.val('123')
    input.trigger('change')
    input.trigger('focusout')
    assert.notOk(input.parent().parent().hasClass('form-group-invalid'))
    assert.notOk(input.parent().parent().find('span.help-inline')[0])
    assert.notOk(input.hasClass('is-invalid'))
  })

  QUnit.test(wrapper + ' - Validate pre-existing error blocks are re-used', function (assert) {
    var form = $('form#new_user'); var input = form.find('input#user_name')
    var label = $('label[for="user_name"]')
    form[0].ClientSideValidations.settings.html_settings.wrapper = wrapper

    input.parent().append($('<div class="invalid-feedback">Error from Server</span>'))
    assert.ok(input.parent().find('div.invalid-feedback:contains("Error from Server")')[0])
    input.val('abc')
    input.trigger('change')
    input.trigger('focusout')
    assert.ok(input.parent().hasClass('form-group-invalid'))
    assert.ok(label.parent().hasClass('form-group-invalid'))
    assert.ok(input.parent().find('div.invalid-feedback:contains("is invalid")').length === 1)
    assert.ok(form.find('div.invalid-feedback').length === 1)
  })

  QUnit.test(wrapper + ' - Validate input-group', function (assert) {
    var form = $('form#new_user'); var input = form.find('input#user_username')
    form[0].ClientSideValidations.settings.html_settings.wrapper = wrapper

    input.trigger('change')
    input.trigger('focusout')
    assert.ok(input.closest('.input-group-prepend').find('div.invalid-feedback').length === 0)
    assert.ok(input.closest('.input-group').find('div.invalid-feedback').length === 1)

    input.val('abc')
    input.trigger('change')
    input.trigger('focusout')
    assert.ok(input.closest('.input-group').find('div.invalid-feedback').length === 0)
  })

  QUnit.test(wrapper + ' - Inserts before form texts', function (assert) {
    var form = $('form#new_user')
    var input = form.find('input#user_password')
    form[0].ClientSideValidations.settings.html_settings.wrapper = wrapper

    input.trigger('focusout')
    assert.ok(input.parent().find('.invalid-feedback:contains("must be present") + .form-text')[0])
  })
}
