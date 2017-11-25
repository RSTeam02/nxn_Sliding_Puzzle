export class Shuffle {

    /**
     * 
     * solvable?
     * idea, references: https://www.sitepoint.com/randomizing-sliding-puzzle-tiles/
     * https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html   
     */


    constructor() {
        this.arr = []

    }

    previewOrder(arr) {
        let previewArr = [];

        for (let i = 0; i < arr.length; i++) {
            previewArr[i] = []
            for (let j = 0; j < arr[i].length; j++) {
                previewArr[i][j] = arr[i][j].val;
            }
        }
        //2 dim => 1 dim
        return previewArr.join(",").split(",");
    }


    randomOrder(arr, mxn) {
        this.arr = arr;
        var shuffled = [];

        do {
            for (let i = 0; i < this.arr.length; i++) {
                for (let j = 0; j < this.arr[i].length; j++) {
                    let h = Math.floor(Math.random() * mxn.m);
                    let v = Math.floor(Math.random() * mxn.n);
                    let tmp = this.arr[i][j];
                    this.arr[i][j] = this.arr[h][v];
                    this.arr[h][v] = tmp;
                }
            }
        } while (!this.solvable(mxn));

        for (let i = 0; i < this.arr.length; i++) {
            shuffled[i] = []
            for (let j = 0; j < this.arr[i].length; j++) {
                shuffled[i][j] = this.arr[i][j].val;
            }
        }
        //2 dim => 1 dim        
        return shuffled.join(",").split(",");
    }

    //compare for testing
    compareMat(shuffled) {
        var toCompare = [[7, 1, 2], [5, 3, 9], [8, 4, 6]];
        var equal = false;

        for (let i = 0; i < toCompare.length; i++) {
            for (let j = 0; j < toCompare[i].length; j++) {
                if (shuffled[i][j] === toCompare[i][j]) {
                    equal = true;
                } else {
                    equal = false;
                    break;
                }
            }
            if (!equal) {
                break;
            }
        }
        return equal;
    }


    countInv(i, j) {
        let shift = 0;
        let tileNum = j * this.arr.length + i;
        let tileVal = this.arr[i][j].y * this.arr.length + this.arr[i][j].x;
        let last = Math.pow(this.arr.length, 2);

        for (var i = tileNum + 1; i < last; i++) {
            var h = i % this.arr.length;
            var v = Math.floor(i / this.arr.length);
            var val = this.arr[h][v].y * this.arr.length + this.arr[h][v].x;
            if (tileVal > val && tileVal !== last - 1) {
                shift++;
            }
        }
        return shift;
    }

    sumInv() {
        var shift = 0;
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                shift += this.countInv(i, j);
            }
        }
        return shift;
    }

    solvable(mxn) {
        /*every game should have the same number inversions (shuffling degree?) of the average, except phrase mode 
        => a letter could occur more than 1 time.*/
        //if (this.sumInv() === avgInv) {
        /*when last (empty) element in the right bottom corner &&
        ( (grid width odd) && (#inversions even) )  ||  ( (grid width even) && ((blank on odd row from bottom) == (#inversions even)) )*/
        if (this.arr[mxn.m - 1][mxn.n - 1].val === (mxn.m * mxn.n)) {
            if ((mxn.m % 2 !== 0 && this.sumInv() % 2 === 0) || (mxn.m % 2 === 0 && this.arr[mxn.m - 1][mxn.m - 1].x % 2 !== this.sumInv() % 2) && this.arr[mxn.m - 1][mxn.m - 1].y % 2 !== this.sumInv() % 2) {
                return true;
            }
        }
        //}
    }

}
