$(document).ready(function(){
    $('button.next').click(function(){
        $(this).parents('.step').hide();
        $(this).parents('.step').next().css('display', 'table-cell');
    });

    $('.step button.start').click(function(){
        var step = $(this).parents('.step');
       var type = step.attr('timetype');
        var duration = step.attr('duration');
        if(type == 'soak'){
            startSoakTimer(duration, step);
        } else {
            startDevTimer(duration, step);
        }
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
});

var oneStopUp = 1.25, twoStopsUp = 1.5, devTime = 210;

function startSoakTimer(duration, stepEl){
    var timer = 0;
    var max = parseInt(stepEl.attr('duration'));
    stepEl.find('.instruct').html('Soak').addClass('blink_me');
    stepEl.find('.timer').css('visibility', 'visible');
    var t = setInterval(function () {
        timer++;
        var percentage = (timer / max) * 100;

        stepEl.find('.progress .progress-bar').css('width', percentage + '%');
        stepEl.find('.timer').html(convertSecsToTime(timer) + '/' + convertSecsToTime(max));


        if (timer >= max) {
            $("#beep")[0].play();
            clearInterval(t);
        }
    }, 1000);
}

function startDevTimer(duration, stepEl) {
    var timer = 0;
    var max = parseInt(stepEl.attr('duration'));
    var thirtySecCount = 0;
    stepEl.find('.instruct').html('Agitate').addClass('blink_me');
    stepEl.find('.timer').css('visibility', 'visible');
    $('#agitate_sound')[0].play();
    var t = setInterval(function () {
        timer++;
        var percentage = (timer / max) * 100;

        stepEl.find('.progress .progress-bar').css('width', percentage + '%');
        stepEl.find('.timer').html(convertSecsToTime(timer) + '/' + convertSecsToTime(max));

        if(timer == 15){
            $("#wait_sound")[0].play();
            stepEl.find('.instruct').html('Wait').addClass('blink_me');
        }

        if((thirtySecCount == 30) && (timer < (max-15))){
            $("#invert_sound")[0].play();
            stepEl.find('.instruct').html('Invert 4x').addClass('blink_me');
            thirtySecCount = 0;
        }

        if(timer == (max-15)){
            $("#pour_sound")[0].play();

            stepEl.find('.instruct').html('Pour out').addClass('blink_me');
        }

        if (timer >= max) {
            $("#beep")[0].play();
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