$(document).ready(function(){
    preloadImages(["images/img043.jpg"]);

    var noSleep = new NoSleep();
    noSleep.enable();

    $('button.next').click(function(){
        var that = $(this);
        $('.steps-wrapper').animate({
            scrollTop: that.parents('.step-wrapper').next()[0].offsetTop
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
        $('#beep')[0].play();
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
    //        $('body').append('<audio class="audio" autoplay><source src="sounds/beep.mp3" type="audio/mpeg"></audio>');
    //        break;
    //    case 'agitate':
    //        $('body').append('<audio class="audio" autoplay><source src="sounds/agitate.mp3" type="audio/mpeg"></audio>');
    //        break;
    //    case 'invert':
    //        $('body').append('<audio class="audio" autoplay><source src="sounds/invert.mp3" type="audio/mpeg"></audio>');
    //        break;
    //    case 'wait':
    //        $('body').append('<audio class="audio" autoplay><source src="sounds/wait.mp3" type="audio/mpeg"></audio>');
    //        break;
    //    case 'pour':
    //        $('body').append('<audio class="audio" autoplay><source src="sounds/pour.mp3" type="audio/mpeg"></audio>');
    //        break;
    //}
    $('#beep_btn').trigger('click');
}



function cleanUpAudio(){
    //$('.audio').remove();
}

