//Copyright (c) 2015, plasma-effect
//All rights reserved.
//Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
onload = function ()
{
    background = new Image();
    background.src = "BG.jpg"
    ishi = new Image();
    ishi.src = "ishi.png";
    mochi = new Image();
    mochi.src = "mochi.png";
    title = new Image();
    title.src = "title.png";
    gameover = new Image();
    gameover.src = "gameover.png";



    canvas = document.getElementById('field');
    if (!canvas || !canvas.getContext) return false;
    ctx = canvas.getContext('2d')
    setInterval(loop, 20);

}

var background;
var ishi;
var mochi;
var mode = 0;
var canvas;
var ctx;
var objtype;//0:ishi 1:mochi
var objflag;//false:notexist true:exist
var objx;
var objy;
var title;
var gameover;
var timer;
var level;
var mousex = 0;
var mousey = 0;
var isclick = 0;
var mode2 = 0;
var score = 0;
var before;
var count;

function init()
{
    objtype = new Array(100);
    objflag = new Array(100);
    objx = new Array(100);
    objy = new Array(100);
    for(var i=0;i<100;++i)
    {
        objtype[i] = 0;
        objflag[i] = false;
        objx[i] = 0;
        objy[i] = 0;
    }
    timer = 0;
    level = 1;
    score = 0;
    count = 0;
    mode2 = false;
    before = new Array(6);

    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "36px '‚l‚r ‚oƒSƒVƒbƒN'";
}

document.addEventListener('click', function (e)
{
    mousex = e.clientX;
    mousey = e.clientY;
    isclick = true;
});

function loop()
{
    ctx.drawImage(background, 0, 0);
    if(mode==0)
    {
        ctx.drawImage(title, 0, 0);
        if(isclick)
        {
            isclick = false;
            mode = 1;
            init();
        }
    }
    else if(mode==1)
    {
        if(mainloop())
        {
            mode = 2;
        }
        draw_mochi();
        ctx.fillText("score:" + score.toString(), 0, 0);
    }
    else if(mode==2)
    {
        draw_mochi();
        ctx.fillText("score:" + score.toString(), 0, 0);
        ctx.drawImage(gameover, 0, 0);
        if(isclick)
        {
            isclick = false;
            mode = 0;
        }
    }
}

function mainloop()
{
    if (mode2)
    {
        if(--timer==0)
        {
            mode = 2;
            isclick = false;
            return true;
        }
    }
    else
    {
        ++timer;

        mochi_move();

        if(isclick)
        {
            mochi_click();
            isclick = false;
        }
        if (timer == (60 / level))
        {
            make_object();
        }
    }

    return false;
}

function mochi_move()
{
    for (var i = 0; i < 100; ++i)
    {
        if (objflag[i])
        {
            objy[i] += 2;

            if (objy[i] == 480) {
                objflag[i] = false;
                if (objtype[i] == 1) {
                    mode2 = true;
                    timer = 100;
                }
                else {
                    ++score;
                }
            }
        }
    }
}

function mochi_click()
{
    for (var i = 0; i < 100; ++i)
    {
        if (objflag[i])
        {
            if ((objx[i] <= mousex) && (mousex <= objx[i] + 64) && (objy[i] <= mousey) && (mousey <= objy[i] + 64)) {
                objflag[i] = false;
                if (objtype[i] == 0)
                {
                    mode2 = true;
                    timer = 100;
                }
                else
                {
                    ++score;
                }
            }
        }
    }
}

function make_object()
{
    var flag = true;
    var random = (Math.random() > 0.5);
    var x = Math.floor((Math.random() * 576));
    while (flag)
    {
        flag = false;
        x = Math.floor((Math.random() * 576));
        for (var i = 0; i <level ;++i)
        {
            if(((before[i]-64)<=x)&&(x<=(before[i]+64)))
            {
                flag = true;
            }
        }
    }
    ++count;
    before[count % level] = x;
    timer = 0;
    if (level < 6 && count == level * 12)
    {
        count = 0;
        ++level;
    }
    for (var i = 0; i < 100; ++i)
    {
        if(!objflag[i])
        {
            objy[i] = -64;
            objx[i] = x;
            objtype[i] = random;
            objflag[i] = true;
            return;
        }
    }
}

function draw_mochi()
{
    for(var i=0;i<100;++i)
    {
        if (!objflag[i])
            continue;
        if (objtype[i] == 0)
        {
            ctx.drawImage(ishi, objx[i], objy[i]);
        }
        else
        {
            ctx.drawImage(mochi, objx[i], objy[i]);
        }
    }
}