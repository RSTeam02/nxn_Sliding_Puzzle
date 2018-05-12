export class SVGDom {

    svgCharNum(tile) {

        let numMode;
        let alphaNum;
        let gap;
        let svgNS = "http://www.w3.org/2000/svg";
        //list ordered/random (preview, gamemode) sequence as integer, chars
        let gId = document.getElementById("tileDisplay");
        let val = this.seq[tile.tileId];
        let txt = document.createElementNS(svgNS, "text");
        let svg = document.getElementById("svgContent");
        svg.setAttribute("viewBox", "-5 -5 " + this.w + " " + this.h);
        txt.setAttribute("cursor", "pointer");
        txt.setAttribute("class", "pos")
        txt.setAttribute("id", "shape" + (val - 1));
        txt.setAttribute("transform", "translate(0,-5)");
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("x", tile.posX + 15);
        txt.setAttribute("y", tile.posY + 26);
        gap = (this.seq.length !== tile.tileId + 1) ? "black" : "transparent";
        txt.setAttribute("fill", gap);        
        txt.setAttribute("font-family", "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif");

        //draw square border for each char or value
        let square = document.createElementNS(svgNS, "rect");
        square.setAttribute("stroke", gap);
        square.setAttribute("transform", "translate(" + tile.posX + " " + tile.posY + ")");
        square.setAttribute("id", "rect" + (val - 1));
        square.setAttribute("x", 0);
        square.setAttribute("y", 0);
        square.setAttribute("width", 30);
        square.setAttribute("height", 30);     
        square.setAttribute("stroke-width", "1");
        square.setAttribute("fill", "none");
        alphaNum = (tile.mode) ? val : tile.chunk[val - 1];
        numMode = document.createTextNode(alphaNum);
        txt.setAttribute("value", alphaNum);
        txt.appendChild(numMode);
        gId.appendChild(square);
        gId.appendChild(txt);
    }
}