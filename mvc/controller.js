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
        this.solution = [];
        this.mode();       
        this.removeEvent = new CustomEvent("removeListener");
        this.initRaster(true);
        this.btnListener();
        this.formatInfo();
    }   

    formatInfo(){
        let n = Math.sqrt(this.nxn + 1);
        $("#formatInfo").html(`Format: ${n}x${n}`);
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
    }

    initView(seq, dim, wc) {
        this.view = new View($('#integer').is(':checked'), seq, dim, wc);
        this.view.svgMat();
    }

    mode() {
        if ($('#integer').is(':checked')) {
            $("#slider").show();
            $("#txtInput").hide();
            $("#buildBtn").hide();
        } else {
            $("#slider").hide();
            $("#txtInput").show();
            $("#buildBtn").show();
        }
    }

    //mxn tiles react on clicks, events
    tileListener() {
        //handler/listener for each tile, compare with solution after each shift  
        for (let i = 0; i < this.tileArr.length; i++) {
            for (let j = 0; j < this.tileArr[i].length; j++) {
                (() => {
                    let handler = () => {
                        this.xyControl(this.tileArr[i][j].sId, this.tileArr[i][j].swapVal - 1, (this.tileArr.length * this.tileArr[i].length) - 1);
                        this.evaluation.evaluate((cb) => {
                            if (cb === "Solved!") {
                                this.view.playerInfo(cb);
                                document.getElementById("shape" + this.nxn).setAttribute("fill", "black");
                                document.dispatchEvent(this.removeEvent);
                            }
                        }, this.solution);
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
        var word = $("#txtInput").val().split(" ");
        var charArrStatic = [];
        var charArr = [];
        var numOfChar = 0;
        var chars;
        var chunks = {};
        var gtRowCol;

        for (let i = 0; i < word.length; i++) {
            chars = word[i].split("|");
            if (chars.length > numOfChar) {
                numOfChar = chars.length;
            }
            charArr.push(chars);
        }

        for (let i = 0; i < word.length; i++) {
            if (charArr[i].length < numOfChar) {
                let addHash = numOfChar - charArr[i].length;
                for (let j = 0; j < addHash; j++) {
                    charArr[i].push("#");
                }
            }
            charArrStatic.push.apply(charArrStatic, charArr[i]);
        }
        gtRowCol = (word.length > numOfChar) ? word.length : numOfChar;

        let diff = Math.pow(gtRowCol, 2) - charArrStatic.length;
        for (let i = 0; i < diff; i++) {
            charArrStatic.push("#");
        }
        chunks = {
            str: charArrStatic,
            numOfWord: word.length,
            gtNumOfChar: numOfChar,
            sqSide: gtRowCol
        }

        return chunks;
    }

    //init solution for comparison
    initSolution() {
        let solutionArr = [];
        let allId = document.getElementsByClassName("pos");

        for (let i = 0; i < Math.pow(this.tileArr.length, 2); i++) {
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
        let dim = 0;
        this.evaluation = new Evaluation();

        dim = ($('#integer').is(':checked')) ? parseInt($('#slider').val()) : wChunk.sqSide;
        this.tileArr = this.tileMat.createTileMat(dim, dim);
        this.nxn = Math.pow(dim, 2) - 1;       
        if (preview) {
            seq = new Shuffle().previewOrder(this.tileArr);
            this.initView(seq, dim, wChunk);
            this.solution = this.initSolution();
            document.getElementById(`shape${this.nxn}`).setAttribute("fill", "black");
        } else {
            seq = new Shuffle().randomOrder(this.tileArr);
            this.initView(seq, dim, wChunk);
            this.initSeq(seq);
        }
        this.view.playerInfo("");
        this.formatInfo();
    }

    //control direction each tile
    xyControl(tile, x, lastElement) {
        lastElement = document.getElementById("shape" + lastElement);
        //swap rows with last, avoid collisions y-axis 
        if (parseInt(tile.getAttribute("x")) === parseInt(lastElement.getAttribute("x"))) {
            if (tile.id === "shape" + x && parseInt(tile.getAttribute("y")) === parseInt(lastElement.getAttribute("y")) + 30) {
                if (parseInt(tile.getAttribute("y")) - 30 === parseInt(lastElement.getAttribute("y"))) {
                    this.swapYLast(tile, lastElement, -30)
                }
            } else {
                if (parseInt(tile.getAttribute("y")) + 30 === parseInt(lastElement.getAttribute("y"))) {
                    this.swapYLast(tile, lastElement, 30);
                }
            }
        }
        //swap cols with last, avoid collisions x-axis    
        if (parseInt(tile.getAttribute("y")) === parseInt(lastElement.getAttribute("y"))) {
            if (tile.id === "shape" + x && parseInt(tile.getAttribute("x")) === parseInt(lastElement.getAttribute("x")) + 30) {
                if (parseInt(tile.getAttribute("x")) - 30 === parseInt(lastElement.getAttribute("x"))) {
                    this.swapXLast(tile, lastElement, -30);
                }
            } else {
                if (parseInt(tile.getAttribute("x")) + 30 === parseInt(lastElement.getAttribute("x"))) {
                    this.swapXLast(tile, lastElement, 30);
                }
            }
        }

    }
    //swap tile with gap
    swapXLast(tile, lastElement, len) {
        tile.setAttribute("x", parseInt(tile.getAttribute("x")) + len);
        lastElement.setAttribute("x", parseInt(lastElement.getAttribute("x")) - len);
    }

    swapYLast(tile, lastElement, len) {
        tile.setAttribute("y", parseInt(tile.getAttribute("y")) + len);
        lastElement.setAttribute("y", parseInt(lastElement.getAttribute("y")) - len);
    }

}