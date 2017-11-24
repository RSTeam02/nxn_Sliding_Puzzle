/**
 * @sakaijun
 * View as SVG => dom
 */

import { SVGDom } from "./svgDom.js";

export class View extends SVGDom{

    //draw eachtile as svg text/square
    constructor(mode, seq, dim, chunk) {
        super();     
        this.chunk = chunk;
        this.mode = mode
        this.dim =dim;
        this.seq = seq;
        this.displaySize();
        console.log(this.chunk.str)
    }

    //mat output as svg
    svgMat() {
        let y = 0;
        let id = 0;
        let n=0;
        let gtRowCol = 0;

    
        for (var i = 0; i < this.dim; i++) {
            var x = 0;
            for (var j = 0; j < this.dim; j++) {
                let tile = {
                    tileId: id,
                    posX: x,
                    posY: y,
                    mxn: this.seq.length,
                    mode: this.mode,
                    chunk: this.chunk.str
                };
                super.svgNum(tile);
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
        this.w = this.dim * 50 + 10;
        this.h = Math.floor(this.w / 1.55);
    }

    playerInfo(str) {
        document.getElementById("pInfo").innerHTML = str;
    }
    
}