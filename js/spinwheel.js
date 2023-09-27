// Helpers
const jsConfetti = new JSConfetti()

shuffle = function (o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

String.prototype.hashCode = function () {
    // See http://www.cse.yorku.ca/~oz/hash.html        
    var hash = 5381;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) + hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
}



$(function () {


});

var danhSachTrungThuong = $('#message')

// WHEEL!
var wheel = {

    timerHandle: 0,
    timerDelay: 33,

    angleCurrent: 0,
    angleDelta: 0,

    size: 290,

    canvasContext: null,

    colors: ['#ffff00',
        '#ffc700',
        '#ff9100',
        '#ff6301',
        '#ff0000',
        '#c6037e',
        '#713697',
        '#444ea1',
        '#2772b2',
        '#0297ba',
        '#008e5b',
        '#8ac819'],

    segments: [],

    seg_colors: [],
    // Cache of segments to colors
    maxSpeed: Math.PI / 16,

    upTime: 1000,
    // How long to spin up for (in ms)
    downTime: 15000,
    // How long to slow down for (in ms)
    spinStart: 1000,

    frames: 0,

    centerX: 300,
    centerY: 300,

    spin: function () {

        // Start the wheel only if it's not already spinning
        if (wheel.timerHandle == 0) {
            wheel.spinStart = new Date().getTime();
            wheel.maxSpeed = Math.PI / (16 + Math.random()); // Randomly vary how hard the spin is
            wheel.frames = 0;
            wheel.sound.play();

            wheel.timerHandle = setInterval(wheel.onTimerTick, wheel.timerDelay);
        }
    },

    onTimerTick: function () {

        wheel.frames++;

        wheel.draw();

        var duration = (new Date().getTime() - wheel.spinStart);
        var progress = 0;
        var finished = false;

        if (duration < wheel.upTime) {
            progress = duration / wheel.upTime;
            wheel.angleDelta = wheel.maxSpeed * Math.sin(progress * Math.PI / 2);
        } else {
            progress = duration / wheel.downTime;
            wheel.angleDelta = wheel.maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
            if (progress >= 1) finished = true;
        }

        wheel.angleCurrent += wheel.angleDelta;
        while (wheel.angleCurrent >= Math.PI * 2)
            // Keep the angle in a reasonable range
            wheel.angleCurrent -= Math.PI * 2;

        if (finished) {
            // $("#counter").html((wheel.frames / duration * 1000) + " FPS");
            clearInterval(wheel.timerHandle);
            wheel.timerHandle = 0;
            wheel.angleDelta = 0;
            let i = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length) - 1;
            console.log(wheel.segments[i]);
            wheel.soundCongrats.play();
            jsConfetti.addConfetti({
                emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
            })
            let congratEffect = setInterval(function () {
                jsConfetti.addConfetti()
            }, 1000)
            danhSachTrungThuong.val(danhSachTrungThuong.val() + wheel.segments[i] + '\n')
            Swal.fire({
                title: 'Chúc mừng bạn!',
                text: "Người may mắn: " + wheel.segments[i],
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Đóng',
                confirmButtonText: 'Xoá tên'
            }).then((result) => {
                clearInterval(congratEffect)
                if (result.isConfirmed) {
                    wheel.segments.splice(i, 1)
                    // wheel.segments.sort();
                    wheel.update();
                }
            })
        }
    },

    init: function (optionList) {
        try {
            wheel.initWheel();
            wheel.initAudio();
            wheel.initCanvas();
            wheel.draw();

            $.extend(wheel, optionList);

        } catch (exceptionData) {
            alert('Wheel is not loaded ' + exceptionData);
        }

    },

    initAudio: function () {
        var sound = document.createElement('audio');
        sound.setAttribute('src', 'spin.wav');
        wheel.sound = sound;
        var soundCongrats = document.createElement('audio');
        soundCongrats.setAttribute('src', 'congrats.mp3');
        wheel.soundCongrats = soundCongrats;
    },

    initCanvas: function () {
        var canvas = $('#wheel #canvas').get(0);

        if ($.browser.msie) {
            canvas = document.createElement('canvas');
            $(canvas).attr('width', 700).attr('height', 700).attr('id', 'canvas').appendTo('.wheel');
            canvas = G_vmlCanvasManager.initElement(canvas);
        }

        canvas.addEventListener("click", wheel.spin, false);
        wheel.canvasContext = canvas.getContext("2d");
    },

    initWheel: function () {
        shuffle(wheel.colors);
        
    },

    // Called when segments have changed
    update: function () {
        // Ensure we start mid way on a item
        //var r = Math.floor(Math.random() * wheel.segments.length);
        var r = 0;
        wheel.angleCurrent = ((r + 0.5) / wheel.segments.length) * Math.PI * 2;

        var segments = wheel.segments;
        var len = segments.length;
        var colors = wheel.colors;
        var colorLen = colors.length;

        // Generate a color cache (so we have consistant coloring)
        var seg_color = new Array();
        for (var i = 0; i < len; i++)
            seg_color.push(colors[segments[i].hashCode().mod(colorLen)]);

        wheel.seg_color = seg_color;

        wheel.draw();
    },

    draw: function () {
        wheel.clear();
        wheel.drawWheel();
        wheel.drawNeedle();
    },

    clear: function () {
        var ctx = wheel.canvasContext;
        ctx.clearRect(0, 0, 1000, 800);
    },

    drawNeedle: function () {
        var ctx = wheel.canvasContext;
        var centerX = wheel.centerX;
        var centerY = wheel.centerY;
        var size = wheel.size;

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.fileStyle = '#ffffff';


        ctx.beginPath();

        ctx.moveTo(centerX + size - 25, centerY);
        ctx.lineTo(centerX + size + 20, centerY - 15);
        ctx.lineTo(centerX + size + 20, centerY + 15);
        ctx.closePath();

        ctx.stroke();
        ctx.fill();

        // Which segment is being pointed to?
        var i = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length) - 1;

        // Now draw the winning name
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = '#000000';
        ctx.font = "2em Arial";
        ctx.fillText(wheel.segments[i], centerX + size + 25, centerY);
        // 
    },

    drawSegment: function (key, lastAngle, angle) {
        var ctx = wheel.canvasContext;
        var centerX = wheel.centerX;
        var centerY = wheel.centerY;
        var size = wheel.size;

        var segments = wheel.segments;
        var len = wheel.segments.length;
        var colors = wheel.seg_color;

        var value = segments[key];

        ctx.save();
        ctx.beginPath();

        // Start in the centre
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, size, lastAngle, angle, false); // Draw a arc around the edge
        ctx.lineTo(centerX, centerY); // Now draw a line back to the centre
        // Clip anything that follows to this area
        //ctx.clip(); // It would be best to clip, but we can double performance without it
        ctx.closePath();

        ctx.fillStyle = colors[key];
        ctx.fill();
        ctx.stroke();

        // Now draw the text
        ctx.save(); // The save ensures this works on Android devices
        ctx.translate(centerX, centerY);
        ctx.rotate((lastAngle + angle) / 2);

        ctx.fillStyle = '#fff';
        ctx.fillText(value.substr(0, 20), size / 2 + 20, 0, 50); // Draw text in middle
        ctx.restore();

        ctx.restore();
    },

    drawWheel: function () {
        var ctx = wheel.canvasContext;

        var angleCurrent = wheel.angleCurrent;
        var lastAngle = angleCurrent;

        var segments = wheel.segments;
        var len = wheel.segments.length;
        var colors = wheel.colors;
        var colorsLen = wheel.colors.length;

        var centerX = wheel.centerX;
        var centerY = wheel.centerY;
        var size = wheel.size;

        var PI2 = Math.PI * 2;

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "1.4em Arial";

        for (let i = 1; i <= len; i++) {
            let angle = PI2 * (i / len) + angleCurrent;
            wheel.drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }

        // Draw a center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, PI2, false);
        ctx.closePath();

        // ctx.textAlign = "left";
        // ctx.textBaseline = "middle";
        // ctx.fillStyle = '#000000';
        // ctx.font = "2em Arial";
        // ctx.fillText("ps25865", centerX + 100, centerY);

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.fill();
        ctx.stroke();

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, PI2, false);
        ctx.closePath();

        ctx.strokeStyle = '#000000';
        ctx.stroke();
    },
}

window.onload = function () {
    wheel.init();
    wheel.update();
    wheel.segments = ['Phúc', 'Phi Gà', "Kiệt Chó Đẻ", "Pháp Ngu"]
    let script = document.createElement('script');
    document.head.appendChild(script);
    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);
}