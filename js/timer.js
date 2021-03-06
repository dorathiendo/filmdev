var images = ['images/background/img043.jpg',
    'images/background/img058.jpg',
    'images/background/img061.jpg',
    'images/background/img149.jpg',
    'images/background/img200.jpg',
    'images/background/img214.jpg',
    'images/background/img204.jpg'];

$(document).ready(function(){
    preloadImages(images);

    var noSleep = new NoSleep();
    noSleep.enable();

    $('.step-wrapper').each(function(key, value){
        $(this).css({
            "background": 'linear-gradient(rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.45)), url("' + images[key] + '")',
            'background-size': 'cover',
            'background-position': 'center',
            'background-attachment': 'fixed'
        });
    });

    $('button.next').click(function(){
        var that = $(this);
        $('.steps-wrapper').animate({
            scrollTop: that.parents('.step-wrapper').next()[0].offsetTop
        });
    });

    $('button.back').click(function(){
        var that = $(this);
        $('.steps-wrapper').animate({
            scrollTop: that.parents('.step-wrapper').prev()[0].offsetTop
        });
    });

    $('.step button.start').click(function(){
        cleanUpAudio();
        var step = $(this).parents('.step');
        var type = step.attr('timetype');
        var duration = step.attr('duration');
        switch(type){
            case 'soak':
                startSoakTimer(duration, step);
                break;
            case 'agitate':
                startAgitateSoakTimer(duration, step);
                break;
            case 'dev':
                startDevTimer(duration, step);
                break;
            default:
                return;
        }
        $(this).attr('disabled', true);
    });

    $('#push-wrapper select').change(function(e){
        var stopsOption = parseInt($(this).val());
        switch(stopsOption){
            case 1:
                $(this).parents('.step').attr('duration', devTime * oneStopUp);
                break;
            case 2:
                $(this).parents('.step').attr('duration', devTime * twoStopsUp);
                break;
            default:
                $(this).parents('.step').attr('duration', devTime);
                break;
        }
    });

    $('#done_btn').click(function(){
        noSleep.disable();
        $('.steps-wrapper').animate({
            scrollTop: 0
        });
    })

    $('#beep_btn').click(function(){
        $('#beep_sound')[0].play();
    });
    $('#agitate_btn').click(function(){
        $('#agitate_sound')[0].play();
    });
    $('#invert_btn').click(function(){
        $('#invert_sound')[0].play();
    });
    $('#wait_btn').click(function(){
        $('#wait_sound')[0].play();
    });
    $('#pour_btn').click(function(){
        $('#pour_sound')[0].play();
    });
});

var oneStopUp = 1.25, twoStopsUp = 1.5, devTime = 210;

function startSoakTimer(duration, stepEl){
    var timer = 0;
    var max = parseInt(stepEl.attr('duration'));
    stepEl.find('.instruct').html('<span class="blink_me">Wait</span>');
    playAudio('wait');
    stepEl.find('.timer').css('visibility', 'visible');
    var t = setInterval(function () {
        timer++;
        var percentage = (timer / max) * 100;

        stepEl.find('.progress .progress-bar').css('width', percentage + '%');
        stepEl.find('.timer').html(convertSecsToTime(timer) + '/' + convertSecsToTime(max));


        if (timer >= max) {
            playAudio('beep');
            clearInterval(t);
        }
    }, 1000);
}

function startDevTimer(duration, stepEl) {
    var timer = 0;
    var max = parseInt(stepEl.attr('duration'));
    var thirtySecCount = 0;
    stepEl.find('.instruct').html('<span class="blink_me">Agitate</span>');
    playAudio('agitate');
    stepEl.find('.timer').css('visibility', 'visible');
    var t = setInterval(function () {
        timer++;
        var percentage = (timer / max) * 100;

        stepEl.find('.progress .progress-bar').css('width', percentage + '%');
        stepEl.find('.timer').html(convertSecsToTime(timer) + '/' + convertSecsToTime(max));

        if(timer == 15){
            playAudio('wait');
            stepEl.find('.instruct').html('<span class="blink_me">Wait</span>');
        }

        if((thirtySecCount == 30) && (timer < (max-15))){
            playAudio('invert');
            stepEl.find('.instruct').html('<span class="blink_me_limited">Invert 4x</span>');
            thirtySecCount = 0;
        }

        if(timer == (max-15)){
            playAudio('pour');
            stepEl.find('.instruct').html('<span class="blink_me">Pour Out</span>');
        }

        if (timer >= max) {
            playAudio('beep');
            clearInterval(t);
        }

        if(timer >= 15){
            thirtySecCount++;
        }
    }, 1000);
}

function startAgitateSoakTimer(duratoin, stepEl){
    var timer = 0;
    var max = parseInt(stepEl.attr('duration'));
    var thirtySecCount = 0;
    stepEl.find('.instruct').html('<span class="blink_me">Agitate</span>');
    playAudio('agitate');
    stepEl.find('.timer').css('visibility', 'visible');
    var t = setInterval(function () {
        timer++;
        var percentage = (timer / max) * 100;

        stepEl.find('.progress .progress-bar').css('width', percentage + '%');
        stepEl.find('.timer').html(convertSecsToTime(timer) + '/' + convertSecsToTime(max));

        if(timer == 15){
            playAudio('wait');
            stepEl.find('.instruct').html('<span class="blink_me">Wait</span>');
        }

        if(timer == (max-15)){
            playAudio('pour');
            stepEl.find('.instruct').html('<span class="blink_me">Pour Out</span>');
        }

        if (timer >= max) {
            playAudio('beep');
            clearInterval(t);
        }

        if(timer >= 15){
            thirtySecCount++;
        }
    }, 1000);
}

function convertSecsToTime(seconds){
    return moment().minutes(0).seconds(seconds).format('mm:ss');
}

function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

function playAudio(type){
    //switch(type){
    //    case 'beep':
    //        //$('body').append('<audio class="audio" autoplay><source src="sounds/beep.mp3" type="audio/mpeg"></audio>');
    //        $('#beep_btn').trigger('click');
    //        break;
    //    case 'agitate':
    //        //$('body').append('<audio class="audio" autoplay><source src="sounds/agitate.mp3" type="audio/mpeg"></audio>');
    //        $('#agitate_btn').trigger('click');
    //        break;
    //    case 'invert':
    //        //$('body').append('<audio class="audio" autoplay><source src="sounds/invert.mp3" type="audio/mpeg"></audio>');
    //        $('#invert_btn').trigger('click');
    //        break;
    //    case 'wait':
    //        //$('body').append('<audio class="audio" autoplay><source src="sounds/wait.mp3" type="audio/mpeg"></audio>');
    //        $('#beep_btn').trigger('click');
    //        break;
    //    case 'pour':
    //        //$('body').append('<audio class="audio" autoplay><source src="sounds/pour.mp3" type="audio/mpeg"></audio>');
    //        $('#beep_btn').trigger('click');
    //        break;
    //}
    $('#' + type + '_btn').trigger('click');
}



function cleanUpAudio(){
    //$('.audio').remove();
}

