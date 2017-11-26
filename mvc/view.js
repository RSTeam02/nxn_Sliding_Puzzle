/**
 * @sakaijun
 * View as SVG => dom
 */

import { SVGDom } from "./svgDom.js";

export class View extends SVGDom{

    //draw eachtile as svg text/square
    constructor(prop) {
        super();     
        this.seq = prop.chunkSeq;
        this.chunk = prop.wordChunk;
        this.mode = prop.mode;
        this.rcLen = prop.rowCol;        
        this.displaySize();        
    }

    //mat output as svg
    svgMat() {
        let y = 0;
        let id = 0;
        let n=0;
    
        for (var i = 0; i < this.rcLen.row; i++) {
            var x = 0;
            for (var j = 0; j < this.rcLen.col; j++) {
                let tile = {
                    tileId: id,
                    seq: this.seq,
                    posX: x,
                    posY: y,        
                    mode: this.mode,
                    chunk: this.chunk
                };
                super.svgCharNum(tile);
                //next row
                x += 30;
                id++;
            }
            //next column
            y += 30;
        }
    }

    
    //scale size for nxn
    displaySize() {
        this.w = this.rcLen.col * 50 + 10;
        this.h = Math.floor((this.rcLen.row * 50 + 10) / 1.55);
    }

    playerInfo(str) {
        document.getElementById("pInfo").innerHTML = str;
    }
    
}