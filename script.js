const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

ctx.scale(30,30);


const arena = createMatrix(10,20);


const colors = [
    null,
    "cyan",
    "yellow",
    "purple",
    "green",
    "red",
    "blue",
    "orange"
];


const pieces = "TJLOSZI";


let score = 0;
let paused = false;



// Hintergrundmusik
const music = new Audio("music/orchestra.mp3");

music.loop = true;
music.volume = 0.3;



const player = {
    pos:{x:0,y:0},
    matrix:null
};





function createMatrix(w,h){

    const matrix=[];

    while(h--){

        matrix.push(new Array(w).fill(0));

    }

    return matrix;

}





function createPiece(type){

    if(type==="T")
    return [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ];


    if(type==="O")
    return [
        [2,2],
        [2,2]
    ];


    if(type==="L")
    return [
        [0,0,3],
        [3,3,3],
        [0,0,0]
    ];


    if(type==="J")
    return [
        [4,0,0],
        [4,4,4],
        [0,0,0]
    ];


    if(type==="I")
    return [
        [5,5,5,5]
    ];


    if(type==="S")
    return [
        [0,6,6],
        [6,6,0],
        [0,0,0]
    ];


    if(type==="Z")
    return [
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ];

}





function draw(){

    ctx.fillStyle="black";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawMatrix(arena,{x:0,y:0});


    drawMatrix(
        player.matrix,
        player.pos
    );

}





function drawMatrix(matrix,offset){

    matrix.forEach((row,y)=>{

        row.forEach((value,x)=>{

            if(value){

                ctx.fillStyle=colors[value];

                ctx.fillRect(
                    x+offset.x,
                    y+offset.y,
                    1,
                    1
                );

            }

        });

    });

}





function collide(){

    const m=player.matrix;
    const o=player.pos;


    for(let y=0;y<m.length;y++){

        for(let x=0;x<m[y].length;x++){


            if(m[y][x]){


                if(
                    !arena[y+o.y] ||
                    arena[y+o.y][x+o.x] !== 0
                ){

                    return true;

                }

            }

        }

    }


    return false;

}





function merge(){

    player.matrix.forEach((row,y)=>{

        row.forEach((value,x)=>{


            if(value){

                arena[
                    y+player.pos.y
                ]
                [
                    x+player.pos.x
                ] = value;

            }


        });


    });


}





function rotate(matrix){

    for(let y=0;y<matrix.length;y++){

        for(let x=0;x<y;x++){


            [
                matrix[x][y],
                matrix[y][x]
            ] =
            [
                matrix[y][x],
                matrix[x][y]
            ];


        }

    }


    matrix.reverse();

}





function playerRotate(){

    const old = player.matrix;


    rotate(player.matrix);


    if(collide()){

        player.matrix = old;

    }

}





function clearLines(){

    let lines=0;


    outer:

    for(let y=arena.length-1;y>=0;y--){


        for(let x=0;x<arena[y].length;x++){


            if(arena[y][x]===0){

                continue outer;

            }


        }



        arena.splice(y,1);


        arena.unshift(
            new Array(10).fill(0)
        );


        lines++;

        y++;

    }




    if(lines){

        score += lines*100;


        document.getElementById("score")
        .innerText=score;

    }


}





function playerReset(){


    player.matrix =
    createPiece(
        pieces[
            Math.floor(
                Math.random()*pieces.length
            )
        ]
    );



    player.pos.y=0;



    player.pos.x =
    Math.floor(
        arena[0].length/2
    )
    -
    Math.floor(
        player.matrix[0].length/2
    );



    if(collide()){


        alert(
            "Game Over! Punkte: " + score
        );



        arena.forEach(row=>{

            row.fill(0);

        });



        score=0;


        document.getElementById("score")
        .innerText=0;


    }


}





function playerDrop(){


    player.pos.y++;



    if(collide()){


        player.pos.y--;


        merge();


        clearLines();


        playerReset();


    }


}





document.addEventListener(
"keydown",
event=>{


    // Musik starten
    if(music.paused){

        music.play();

    }



    if(event.key==="ArrowLeft"){


        player.pos.x--;


        if(collide()){

            player.pos.x++;

        }


    }




    if(event.key==="ArrowRight"){


        player.pos.x++;


        if(collide()){

            player.pos.x--;

        }


    }





    if(event.key==="ArrowDown"){


        playerDrop();


    }




    if(event.key==="ArrowUp"){


        playerRotate();


    }



    draw();


});







document
.getElementById("pause")
.onclick=function(){


    paused=!paused;



    this.innerText =
    paused ?
    "▶ Weiter" :
    "⏸ Pause";


};







document
.getElementById("restart")
.onclick=function(){


    arena.forEach(row=>{

        row.fill(0);

    });



    score=0;



    document
    .getElementById("score")
    .innerText=0;



    playerReset();



};







playerReset();





setInterval(()=>{


    if(!paused){

        playerDrop();

        draw();

    }


},700);




draw();