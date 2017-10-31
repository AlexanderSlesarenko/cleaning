window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
var nav_visible;
var nav = $('#nav');
var intervalID;
var rooms = 0;
var closets = 0;
var total = 0;
var extra_services_sum = 0;
var extra_services_list =[];
var extra_info;
var ROOMS_DICT = {
    0: 'Кол-во комнат',
    1: '1-комнатная',
    2: '2-комнатная',
    3: '3-комнатная',
    4: '4-комнатная',
    5: '5-комнатная'
};
var CLOSETS_DICT = {
    0: 'Кол-во санузлов',
    1: '1 санузел',
    2: '2 санузла',
    3: '3 санузла',
    4: '4 санузла',
    5: '5 санузлов'
};
var PRICES = {
    'room': {
        1: 1590,
        2: 1990,
        3: 2490,
        4: 3190,
        5: 3890
    },
    'closet': 400,
    'внутри холодильника': 600,
    'внутри духовки': 500,
    'мытьё посуды': 300,
    'внутри микроволновки': 300,
    'смена белья': 220,
    'уборка на балконе': 600, // за штуку
    'глажка белья': 500,
    'уборка лотка питомца': 200, // за штуку
    'внутри кухонных шкафов': 400,
    'уборка в гардеробной': 500,
    'мытьё вытяжки': 300,
    'мытьё окон (с вн. ст.)': 200 // за штуку
};

$(document).ready(function(){
    set_float_nav();
    set_form_submit_listener();
    set_phone_mask();
    set_toastr_options();
    set_buttons_blur();
    set_scroll_down();
    set_accordion();
    set_slider_buttons_click_listener();
    // personnel_transform();
    set_mobile_menu();
    set_interval();
    set_picker_click_handler();
    set_extra_services_click_handler();
    set_select_click_handler();
    set_how_we_work_left_right_buttons_listener();
});
var handler = onVisibilityChange($('#slider_buttons'), function(visible) {
    if (visible) {
        intervalID = setInterval(function() {
            var next;
            var current = $("#slider_buttons .item.active").data('name');
            if (current === 4) {
                next = 1;
            } else {
                next = current + 1;
            }
            $('#slider_buttons .item[data-name="' + next + '"]').trigger('auto_click');
        }, 5500);
    } else {
        clearInterval(intervalID);
    }
});
function isElementInViewport (el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
function onVisibilityChange(el, callback) {
    var old_visible;
    return function () {
        var visible = isElementInViewport(el);
        if (visible != old_visible) {
            old_visible = visible;
            callback(visible);
        }
    }
}
function set_interval() {
    $(window).on('DOMContentLoaded load resize scroll', handler);
}
function set_slider_buttons_click_listener() {
  function click_callback(that) {
    if ($(that).hasClass('active')) return;
    $('#slider_buttons .item.active').removeClass('active');
    $(that).addClass('active');
    $('#slider img.active').removeClass('active');
    $('#slider_text > .item').removeClass('active');
    $('#slider img[name="' + $(that).data('name') + '"]').addClass('active');
    $('#slider_text > .item[data-name="' + $(that).data('name') + '"]').addClass('active');
  }
  $("#slider_buttons .first .item:first-of-type, #slider img:first-of-type, #slider_text > .item:first-of-type").addClass('active');
  $("#slider_buttons .item").on('click', function() {
      clearInterval(intervalID);
      click_callback(this);
  });
  $("#slider_buttons .item").on('auto_click', function() {
      click_callback(this);
  });
}
function set_how_we_work_left_right_buttons_listener() {
    $("#slider .right").on('click', function() {
        clearInterval(intervalID);
        var _next;
        var _current = $("#slider_buttons .item.active").data('name');
        if (_current === 4) {
            _next = 1;
        } else {
            _next = _current + 1;
        }
        $('#slider_buttons .item[data-name="' + _next + '"]').trigger('auto_click');
        intervalID = setInterval(function() {
            var next;
            var current = $("#slider_buttons .item.active").data('name');
            if (current === 4) {
                next = 1;
            } else {
                next = current + 1;
            }
            $('#slider_buttons .item[data-name="' + next + '"]').trigger('auto_click');
        }, 5500);
    });
    $("#slider .left").on('click', function() {
        clearInterval(intervalID);
        var _next;
        var _current = $("#slider_buttons .item.active").data('name');
        if (_current === 1) {
            _next = 4;
        } else {
            _next = _current - 1;
        }
        $('#slider_buttons .item[data-name="' + _next + '"]').trigger('auto_click');
        intervalID = setInterval(function() {
            var next;
            var current = $("#slider_buttons .item.active").data('name');
            if (current === 4) {
                next = 1;
            } else {
                next = current + 1;
            }
            $('#slider_buttons .item[data-name="' + next + '"]').trigger('auto_click');
        }, 5500);
    });
}
function set_mobile_menu() {
    $(".menu_mobile_icon").sideNav({
      menuWidth: 300,
      onOpen: function(el) {
          $(".menu_mobile_icon").addClass('active');
      },
      onClose: function(el) {
          $(".menu_mobile_icon").removeClass('active');
      }
    });
}
function personnel_transform() {
    var checkpoint_achieved;
    var checkpoint = $("#personnel").offset().top;
    $(window).scroll(function (e) {
        if (checkpoint_achieved) return;
        if ($(window).scrollTop() + $(window).height() >= checkpoint + 75) {
            checkpoint_achieved = true;
            $("#personnel .item").addClass('active');
        }
    })
}
function set_accordion() {
    var acc = document.getElementsByClassName("accordion_header");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].onclick = function() {
        $(this).siblings('.accordion_header.active').toggleClass('active');
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if ($(panel).css('max-height').indexOf('0') === 0){
          $(panel).css('max-height', panel.scrollHeight);
          $(panel).siblings('.accordion_content').css('max-height', 0);
        } else {
          $(panel).css('max-height', 0);
        }
      }
    }
}
function set_scroll_down() {
  $(".top_pointer_wrapper").click(function() {
    $('html, body').animate({
        scrollTop: $(".block.second").offset().top - 40
    }, 500);
  });
  $('#nav [href="#block_order"]').click(function() {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $(".block.order").offset().top - 40
    }, 500);
  });
  $("#prices button").click(function() {
      rooms = $(this).data('name');
      closets = 1;
      $(".picker.rooms .value").text(ROOMS_DICT[rooms]);
      $(".picker.closets .value").text(CLOSETS_DICT[closets]);
      check_rooms_disabled();
      check_closets_disabled();
    $('html, body').animate({
        scrollTop: $(".block.order").offset().top - 40
    }, 500);
  });
  $("#slide-out button").click(function() {
    $(".menu_mobile_icon").sideNav('hide');
    $('html, body').animate({
        scrollTop: $(".block.order").offset().top - 40
    }, 500);
  });
  $('[href="#block_benefits"]').click(function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $("#block_benefits").offset().top - 40
    }, 500);
  });
  $('[href="#block_how_we_works"]').click(function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $("#block_how_we_works").offset().top - 40
    }, 500);
  });
  $('[href="#block_eco"]').click(function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $("#block_eco").offset().top - 40
    }, 500);
  });
  $('[href="#block_prices"]').click(function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $("#block_prices").offset().top - 40
    }, 500);
  });
  $('[href="#block_faq"]').click(function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $("#block_faq").offset().top - 40
    }, 500);
  });
}
function set_buttons_blur() {
  $("button").click(function(event) {
    $(this).blur();
  });
}
function set_toastr_options() {
    toastr.options = {
        "positionClass": "toast-top-center"
    }
}
function set_phone_mask() {
    $('[name="phone"]').mask("+7 (999) 999-99-99");
}
function set_form_submit_listener() {
    $('form').submit(function(){
        var that = this;
        $(this).find('button[type="submit"]').prop('disabled', true);
        var name = $(this).find('input[name="name"]').val();
        var phone = $(this).find('input[name="phone"]').val();
        if (!name.replace(/ /g,'')) {
            toastr.info('Пожалуйста, укажите Ваше имя.');
            $(this).find('button[type="submit"]').prop('disabled', false);
            return false;
        }
        if (!phone) {
            toastr.info('Пожалуйста, введите номер телефона.');
            $(this).find('button[type="submit"]').prop('disabled', false);
            return false;
        }

		$.post(
		    'https://script.google.com/macros/s/AKfycbxUQmB4xywU_aqtsjEwX2Y6TXTgg8gLQ78ecU1vWlQ5Wu7Frgk/exec',
            {
                'имя': name,
                'телефон': phone,
                'комнаты': extra_info ? rooms : undefined,
                'санузлы': extra_info ? closets : undefined,
                'доп. услуги': (extra_info && extra_services_list.length > 0) ? extra_services_list : undefined,
                'сумма': extra_info ? total : undefined
            }, function(){}
		);
        $(that).find('input[name="name"]').val('');
        $(that).find('input[name="phone"]').val('');
        $(that).find('button[type="submit"]').prop('disabled', false);
        toastr.success('Заявка успешно отправлена.');
		return false;
	});
}
function set_float_nav() {
    $(window).scroll(function() {
        var scroll_top = $(window).scrollTop();
        if (scroll_top > 0) {
            if (!nav_visible) {
                nav_visible = true;
                nav.addClass('visible');
            }
        } else {
            nav_visible = false;
            nav.removeClass('visible');
        }
    });
}
function check_rooms_disabled(val) {
    if (rooms === 5) {
        $(".picker.rooms .plus").addClass('disabled');
    } else {
        $(".picker.rooms .plus").removeClass('disabled');
    }
    if (rooms === 0) {
        $(".picker.rooms .minus").addClass('disabled');
    } else {
        $(".picker.rooms .minus").removeClass('disabled');
    }
    check_total();
}
function check_closets_disabled(val) {
    if (closets === 5) {
        $(".picker.closets .plus").addClass('disabled');
    } else {
        $(".picker.closets .plus").removeClass('disabled');
    }
    if (closets === 0) {
        $(".picker.closets .minus").addClass('disabled');
    } else {
        $(".picker.closets .minus").removeClass('disabled');
    }
    check_total();
}
function set_picker_click_handler() {
  $(".picker.rooms .plus").click(function() {
    if (rooms === 5) return;
    rooms ++;
    $(".picker.rooms .value").text(ROOMS_DICT[rooms]);
    check_rooms_disabled();
  });
  $(".picker.rooms .minus").click(function() {
    if (rooms === 0) return;
    rooms --;
    $(".picker.rooms .value").text(ROOMS_DICT[rooms]);
    check_rooms_disabled();
  });
  $(".picker.closets .plus").click(function() {
    if (closets === 5) return;
    closets ++;
    $(".picker.closets .value").text(CLOSETS_DICT[closets]);
    check_closets_disabled();
  });
  $(".picker.closets .minus").click(function() {
    if (closets === 0) return;
    closets --;
    $(".picker.closets .value").text(CLOSETS_DICT[closets]);
    check_closets_disabled();
  });
}
function check_total() {
    if (closets === 0 || rooms === 0) {
        extra_info = false;
        $(".total .variable, .total .currency").addClass('hidden');
    } else {
        extra_info = true;
        get_extra_services();
        total = PRICES['room'][rooms] + PRICES['closet'] * (closets - 1) + extra_services_sum;
        $(".total .variable").text(total);
        $(".total .variable, .total .currency").removeClass('hidden');
    }
}
function get_extra_services() {
    extra_services_sum = 0;
    extra_services_list = [];
      $(".extra_services label input:checked").each(function (index, item) {
          var cls = $(item).attr('class');
          var multiply;
          if (cls) {
              multiply = parseInt($('div.' + cls + ' > .dropdown .selected').text());
          }
          extra_services_sum = extra_services_sum + PRICES[$(item).siblings('span').text()] * (multiply ? multiply : 1);
          if (multiply) {
              extra_services_list.push($(item).siblings('span').text() + '(' + multiply + ')');
          } else {
              extra_services_list.push($(item).siblings('span').text());
          }
      });
}
function set_extra_services_click_handler() {
  $(".extra_services label input").click(function() {
      var cls = $(this).attr('class');
      if (cls) {
          if ($(this).is(":checked")) {
              $('div.' + cls + ' > .dropdown').css('display', 'inline-block');
          } else {
              $('div.' + cls + ' > .dropdown').css('display', 'none');
          }
      }
      check_total();
  });
}
function set_select_click_handler() {
    $( "select" ).change(function(val) {
      check_total();
    });
}
