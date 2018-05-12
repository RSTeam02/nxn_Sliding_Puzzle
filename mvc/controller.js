/**
 * @sakaijun
 * Control unit 
 * +define a 2x2, 3x3 4x4 or 5x5 Matrix
 * +shuffle 0-24, 0-15, 0-8, 0-3, Integer
 * 
 */

import { TileMatrix } from "./tileMatrix.js";
import { View } from "./view.js";
import { Shuffle } from "./shuffle.js";
import { Evaluation } from "./evaluation.js";

export class Controller {

    constructor() {
        this.mxn = {
            row: 0,
            col: 0
        }
        this.solution = [];
        this.mode();
        this.removeEvent = new CustomEvent("removeListener");
        this.initRaster(true);
        this.btnListener();
        this.formatInfo();
        this.aniCheck();

    }

    setRow(m) {
        this.mxn.row = m;
    }

    setCol(n) {
        this.mxn.col = n;
    }

    getRC() {
        return this.mxn;
    }


    formatInfo() {

        $("#formatInfo").html(`Format: ${this.getRC().row}x${this.getRC().col}`);
    }
    btnListener() {
        $("#slider, .mode, #buildBtn").on('input click', (event) => {
            this.initRaster(true);
        });

        $(".mode").on('click', () => {
            this.mode();
        });

        $("#ng").click(() => {
            //game starts => preview mode false
            this.initRaster(false);
            this.tileListener();
        });

        $("#ani").click(()=>{
           this.aniCheck();
        });
    }

    aniCheck(){
        $("#ani").prop("checked") ? $("#speed").attr("disabled", false) : $("#speed").attr("disabled", true);
    }

    initView(seq, wc) {
        let viewProp = {
            mode: $('#integer').is(':checked'),
            chunkSeq: seq,
            rowCol: this.getRC(),
            wordChunk: wc
        }
        this.view = new View(viewProp);
        this.view.svgMat();
    }

    mode() {
        if ($('#integer').is(':checked')) {
            $("#slider").show();
            $(".mxnChar").hide();            
            $("#info90").html("");           
            $("#revInfo").html("");
        } else {
            $("#slider").hide();
            $(".mxnChar").show();           
            $("#info90").html("orthogonal");         
            $("#revInfo").html("reverse");
        }
    }

    //mxn tiles react on clicks, events
    tileListener() {
        //handler/listener for each tile, compare with solution after each shift
        for (let i = 0; i < this.tileArr.length; i++) {
            for (let j = 0; j < this.tileArr[i].length; j++) {
                //console.log(this.tileArr.length +" " +this.tileArr[i].length)
                (() => {
                    let handler = () => {
                        this.xyControl(this.tileArr[i][j].sId, this.tileArr[i][j].swapVal - 1, (this.tileArr.length * this.tileArr[i].length) - 1,()=>{
                            this.evaluation.evaluate((cb) => {
                                if (cb === "Solved!") {
                                    this.view.playerInfo(cb);
                                    document.getElementById(`shape${((this.getRC().row * this.getRC().col) - 1)}`).setAttribute("fill", "black");
                                    document.getElementById(`rect${((this.getRC().row * this.getRC().col) - 1)}`).setAttribute("stroke", "black");
                                    document.dispatchEvent(this.removeEvent);
                                }
                            }, this.solution);
                        });                       
                    };
                    this.clickListener(true, this.tileArr[i][j], handler);
                    document.addEventListener("removeListener", () => {
                        if (i < this.tileArr.length && j < this.tileArr[i].length) {
                            this.clickListener(false, this.tileArr[i][j], handler);
                        }
                    });
                })();
            }
        }
    }

    //string in chunks, fill spaces with hashtags
    wordChunk() {
        let word = $("#txtInput").val().split(" ");
        let charArrStatic = [];
        let charArr = [];
        let charArrCp = [];
        let numOfChar = 0;
        let chars;

        for (let i = 0; i < word.length; i++) {
            chars = word[i].split("|");
            if (chars.length > numOfChar) {
                numOfChar = chars.length;
            }
            charArr.push(chars);
        }

        for (let i = 0; i < word.length; i++) {
            charArrCp[i] = new Array(word.length);
            charArrCp[i] = ($('#rev').is(':checked')) ? charArr[(word.length - 1) - i] : charArr[i];
            if (charArrCp[i].length < numOfChar) {
                let addHash = numOfChar - charArrCp[i].length;
                for (let j = 0; j < addHash; j++) {
                    charArrCp[i].push("#");
                }
            }
            charArrStatic.push.apply(charArrStatic, charArrCp[i]);
        }
        this.setRow(word.length);
        this.setCol(numOfChar);        

        return ($('#ortho').is(':checked')) ? this.rotateChunk(charArrCp) : charArrStatic;
    }

    //rotate puzzle by 90°
    rotateChunk(charArr){
        let numOfChar = charArr[0].length;
        let wordlen = charArr.length;
        let charArrStatic90 = [];
        let charArr90 = new Array(numOfChar);
        
        for (let i = 0; i < numOfChar; i++) {
            charArr90[i] = new Array(wordlen);
            for (let j = 0; j < wordlen; j++) {
                charArr90[i][j] = charArr[j][i];
            }
            charArrStatic90.push.apply(charArrStatic90, charArr90[i]);
        }
        this.setCol(wordlen);
        this.setRow(numOfChar);
        
        return charArrStatic90;
    }

    //init solution for comparison
    initSolution() {
        let solutionArr = [];
        let allId = document.getElementsByClassName("pos");

        for (let i = 0; i < (this.getRC().row * this.getRC().col); i++) {
            solutionArr[i] = `${allId[i].getAttribute("value")}=${allId[i].getAttribute("x")},${allId[i].getAttribute("y")}`;
        }
        return solutionArr;
    }


    //when game starts, enable eventlisteners, when end, disable for each tile
    clickListener(click, tile, handler) {
        (click)
            ? tile.sId.addEventListener("click", handler, false)
            : tile.sId.removeEventListener("click", handler, false);
    }

    //init random sequence to tiles
    initSeq(seq) {
        let idx = 0;

        for (let i = 0; i < this.tileArr.length; i++) {
            for (let j = 0; j < this.tileArr[i].length; j++) {
                this.tileArr[i][j].sId = document.getElementById("shape" + idx);
                this.tileArr[i][j].swapVal = idx + 1;
                idx++;
            }
        }
    }

    //preview === ordered, solution state, !preview === when game starts, random state, tiles reacts on events
    initRaster(preview) {
        let wChunk = this.wordChunk();
        let seq = [];
        this.tileMat = new TileMatrix();
        this.evaluation = new Evaluation();

        if ($('#integer').is(':checked')) {
            this.setRow(parseInt($('#slider').val()));
            this.setCol(parseInt($('#slider').val()));
        }

        this.tileArr = this.tileMat.createTileMat(this.getRC());

        if (preview) {
            seq = new Shuffle().randomOrder(this.tileArr, preview);
            this.initView(seq, wChunk);
            this.solution = this.initSolution();
            document.getElementById(`shape${((this.getRC().row * this.getRC().col) - 1)}`).setAttribute("fill", "black");
            document.getElementById(`rect${((this.getRC().row * this.getRC().col) - 1)}`).setAttribute("stroke", "black");
        } else {
            seq = new Shuffle().randomOrder(this.tileArr, preview);
            this.initView(seq, wChunk);
            this.initSeq(seq);
        }
        this.view.playerInfo("");
        this.formatInfo();
    }

    //control direction each tile
    xyControl(tile, id, lastElement, cb) { 
        var le = document.getElementById(`shape${lastElement}`);
        var finished = false;
        //swap rows with last, avoid collisions y-axis 
        if (parseInt(tile.getAttribute("x")) === parseInt(le.getAttribute("x"))) {
            
            if (tile.id === "shape" + id && parseInt(tile.getAttribute("y")) === parseInt(le.getAttribute("y")) + 30) {
                if (parseInt(tile.getAttribute("y")) - 30 === parseInt(le.getAttribute("y"))) {
                    cb(this.swapXYLast("y", id, le, -30, cb))
                }
            } else {
                if (parseInt(tile.getAttribute("y")) + 30 === parseInt(le.getAttribute("y"))) {
                    cb(this.swapXYLast("y", id, le, 30, cb));
                }
            }          
        }
        //swap cols with last, avoid collisions x-axis    
        if (parseInt(tile.getAttribute("y")) === parseInt(le.getAttribute("y"))) {
            if (tile.id === "shape" + id && parseInt(tile.getAttribute("x")) === parseInt(le.getAttribute("x")) + 30) {
                if (parseInt(tile.getAttribute("x")) - 30 === parseInt(le.getAttribute("x"))) {
                    cb(this.swapXYLast("x", id, le, -30, cb));
                }
            } else {
                if (parseInt(tile.getAttribute("x")) + 30 === parseInt(le.getAttribute("x"))) {
                    cb(this.swapXYLast("x", id, le, 30, cb));
                }
            }
        }
    }

    //swap tile with gap
    swapXYLast(axis, id, le, len, call) {
        var cnt =0;
        var tile = document.getElementById(`shape${id}`);
        var rect = document.getElementById(`rect${id}`);
        var currentPos = parseInt(tile.getAttribute(axis));
        var currentPosRect = parseInt(rect.getAttribute(axis));
        if($('#ani').prop('checked')){            
            var x = setInterval(() => {            
                tile.setAttribute(axis, currentPos + cnt);
                rect.setAttribute(axis, currentPosRect + cnt);
                if(cnt == len){
                    clearInterval(x);
                    call();
                }
                (len < 0) ? cnt-- : cnt++;
            },  $("#speed").attr("max")-$("#speed").val());
        }else{            
            tile.setAttribute(axis, parseInt(tile.getAttribute(axis)) + len);
            rect.setAttribute(axis, parseInt(rect.getAttribute(axis)) + len);
            call();
        }
        le.setAttribute(axis, parseInt(le.getAttribute(axis)) - len);
    }

}