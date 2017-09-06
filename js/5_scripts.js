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
    'room': 100,
    'closet': 100,
    'внутри холодильника': 100,
    'внутри духовки': 100,
    'мытьё посуды': 100,
    'внутри микроволновки': 100,
    'смена белья': 100,
    'глажка белья': 100,
    'уборка лотка питомца': 100,
    'внутри кухонных шкафов': 100,
    'уборка в гардеробной': 100,
    'мытьё вытяжки': 100
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
    personnel_transform();
    set_mobile_menu();
    set_interval();
    set_picker_click_handler();
    set_extra_services_click_handler();
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
        }, 4000);
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
function set_scroll_down() {
  $(".top_pointer_wrapper").click(function() {
    $('html, body').animate({
        scrollTop: $(".block.second").offset().top - 60
    }, 500);
  });
  $("#nav button, #prices button").click(function() {
    $('html, body').animate({
        scrollTop: $(".block.order").offset().top - 60
    }, 500);
  });
  $("#slide-out button").click(function() {
    $(".menu_mobile_icon").sideNav('hide');
    $('html, body').animate({
        scrollTop: $(".block.order").offset().top - 60
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
            'https://script.google.com/macros/s/AKfycbw9iZeumDlu_sCtBHci8hp4Zf6S2EbK87ncis8J6t7fTWH4fYQ/exec',
			{
				name : name,
				phone : phone
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
        $(".total .variable, .total .currency").addClass('hidden');
    } else {
        total = PRICES['room'] * rooms + PRICES['closet'] * (closets - 1);
        $(".total .variable").text(total);
        $(".total .variable, .total .currency").removeClass('hidden');
    }
}
function set_extra_services_click_handler() {
  $(".extra_services label input").click(function() {
      extra_services_sum = 0;
      $(".extra_services label input:checked").each(function (index, item) {
          extra_services_sum = extra_services_sum + PRICES[$(item).siblings('span').text()];
      });
      console.log(extra_services_sum);
  });

}