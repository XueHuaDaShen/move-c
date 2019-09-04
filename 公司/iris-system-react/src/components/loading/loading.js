/* eslint-disable no-undef */
/* eslint-disable func-names */
import loading from 'static/icons/icon-loading.gif';

const wrap = $(`<div class="my-loading-wrap"><img src=${loading} /></div>`);
export const appendLoading = function() {
  $('body').append(wrap);
  $('.my-loading-wrap').css({
    height: $(document).height(),
  });
};

export const removeLoading = function() {
  $('.my-loading-wrap').remove();
};
