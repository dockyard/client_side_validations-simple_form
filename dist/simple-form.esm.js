/*!
 * Client Side Validations Simple Form JS (Default) - v0.2.0 (https://github.com/DavyJonesLocker/client_side_validations-simple_form)
 * Copyright (c) 2021 Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */

import $ from 'jquery';
import ClientSideValidations from '@client-side-validations/client-side-validations';

ClientSideValidations.formBuilders['SimpleForm::FormBuilder'] = {
  add: function add(element, settings, message) {
    this.wrapper(settings.wrapper).add.call(this, element, settings, message);
  },
  remove: function remove(element, settings) {
    this.wrapper(settings.wrapper).remove.call(this, element, settings);
  },
  wrapper: function wrapper(name) {
    return this.wrappers[name] || this.wrappers["default"];
  },
  wrappers: {
    "default": {
      add: function add(element, settings, message) {
        var wrapper = element.closest(settings.wrapper_tag + '.' + settings.wrapper_class.replace(/ /g, '.'));
        var errorElement = wrapper.find(settings.error_tag + '.' + settings.error_class.replace(/ /g, '.'));

        if (!errorElement.length) {
          errorElement = $('<' + settings.error_tag + '>', {
            "class": settings.error_class,
            text: message
          });
          wrapper.append(errorElement);
        }

        wrapper.addClass(settings.wrapper_error_class);
        return errorElement.text(message);
      },
      remove: function remove(element, settings) {
        var wrapper = element.closest(settings.wrapper_tag + '.' + settings.wrapper_class.replace(/ /g, '.') + '.' + settings.wrapper_error_class);
        var errorElement = wrapper.find(settings.error_tag + '.' + settings.error_class.replace(/ /g, '.'));
        wrapper.removeClass(settings.wrapper_error_class);
        return errorElement.remove();
      }
    }
  }
};
