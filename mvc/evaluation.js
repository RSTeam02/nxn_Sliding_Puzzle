/**
 * @sakaijun
 * 
 * compare steps with solution
 * return "Solved!" if all placed right
 *  
 */

export class Evaluation {

    evaluate(callback, solution) {
        let placedRight = 0;
        let goal = "";
        let steps = [];
        let allId = document.getElementsByClassName("pos");
        //track each step
        for (let i = 0; i < allId.length; i++) {
            steps[i] = `${allId[i].getAttribute("value")}=${allId[i].getAttribute("x")},${allId[i].getAttribute("y")}`;
        }

        //compare
        for (let i = 0; i < solution.length; i++) {
            for (let j = 0; j < steps.length; j++) {
                if (solution[i] === steps[j]) {
                    placedRight++;
                    goal = (placedRight === solution.length) ? "Solved!" : "";
                }
            }
        }
        callback(goal);
    }

}