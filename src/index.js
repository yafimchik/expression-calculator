function eval() {
    // Do not use eval!!!
    return;
}
function isOperand(operand){
    let result = Number(operand);
    return (!(isNaN(result)));
      
 }
function isAction(expr){
    let actions = "/*+-()";
    return (actions.indexOf(expr) == -1)? false: true;
}
function isSign(expr){
    let actions = "-";
    return (actions.indexOf(expr) == -1)? false: true;
}
function findOperandTail(expr = "",start = 0,direction = "->"){
    let startSubStr = start;
    let endSubStr = start;

    let j = start;
    if (direction == "<-"){
        if (start == 0) return 0;
        endSubStr--;
        for (j = endSubStr; j >= 0; j--){
            if (isAction(expr[j])){
                break;
            }
        }
        if (j == 0 || (isSign(expr[j]) && isAction(expr[j - 1]))) j--;
        startSubStr = j + 1;
        return startSubStr;
    }
    if (direction == "->"){
        if (start == expr.length - 1) return expr.length - 1; 
        startSubStr++;
        for (j = startSubStr; j < expr.length; j++){
            if (isAction(expr[j])){
                if (j != startSubStr) break;
            }
        }    
        endSubStr = j - 1;
        return endSubStr;
    }
}

function cutAction(expr){
    let i = 0;
    let operandA = 0;
    let operandB = 0;

    if (isOperand(expr)) return Number(expr);
    
    for (i = 0; i < expr.length; i++){
        if (expr[i] == "("){
 
            let startSubStr = i;
            let endSubStr = i;
            let brackets = 1;
            let substr = "";
            let j = i;
            while (brackets > 0){
                j++;
                if (expr[j] == "(") brackets++;
                if (expr[j] == ")") brackets--;
            }
            endSubStr = j;
            substr = expr.substring(startSubStr + 1, endSubStr);
            operandA = cutAction(substr);
            if (endSubStr == (expr.length - 1)) expr = expr.slice(0,startSubStr)+String(operandA);
            else expr = expr.slice(0,startSubStr)+String(operandA)+expr.slice(endSubStr + 1);
            return cutAction(expr);
        }
    }

    for (i = 1; i < expr.length; i++){
        if (expr[i] == "*" || expr[i] == "/"){
 
            let startCut = 0;
            let endCut = 0;
            let startSubStr = i;
            let endSubStr = i - 1;
            let substr = "";
            let j = i;
            startSubStr = findOperandTail(expr,i , "<-");
            
            startCut = startSubStr;
            substr = expr.substring(startSubStr, endSubStr + 1);
            
            if (isOperand(substr)) operandA = Number(substr);
            else throw "Bad operandA";

            startSubStr = i + 1;
            endSubStr = i + 1;
            substr = "";
        
            endSubStr = findOperandTail(expr,i , "->");
            endCut = endSubStr;
            substr = expr.substring(startSubStr, endSubStr + 1);
            
            if (isOperand(substr)) operandB = Number(substr);
            else throw "Bad operandB";
            let firstCat = "";
            let secondCat = "";
            if (startCut > 0){
                firstCat = expr.slice(0, startCut);
            }
            if (endCut < expr.length - 1){
                secondCat = expr.slice(endCut + 1);
            }
            if (expr[i] == "/" && operandB == 0) throw "TypeError: Division by zero."
            let result = (expr[i] == "*")? operandA * operandB: operandA / operandB;
            
            expr = firstCat + String(result) + secondCat;
            return cutAction(expr);
        }
    }
    for (i = 1; i < expr.length; i++){
        if (expr[i] == "+" || expr[i] == "-"){
            if (i == expr.length - 1) throw ("+- wrong places: " + expr);
            let startCut = 0;
            let endCut = 0;
            let startSubStr = i;
            let endSubStr = i - 1;
            let substr = "";
            
            startSubStr = findOperandTail(expr,i , "<-");
            startCut = startSubStr;
            substr = expr.substring(startSubStr, endSubStr + 1);
            
            if (isOperand(substr)) operandA = Number(substr);
            else operandA = 0;

            startSubStr = i + 1;
            endSubStr = i + 1;
            substr = "";
            
            endSubStr = findOperandTail(expr,i , "->");
            endCut = endSubStr;
            substr = expr.substring(startSubStr, endSubStr + 1);
            
            if (isOperand(substr)) operandB = Number(substr);
            else throw "TypeError: Division by zero.";
            let firstCat = "";
            let secondCat = "";
            if (startCut > 0){
                firstCat = expr.slice(0, startCut);
            }
            if (endCut < expr.length - 1){
                secondCat = expr.slice(endCut + 1);
            }
            let result = (expr[i] == "+")? operandA + operandB: operandA - operandB;
            expr = firstCat + String(result) + secondCat;
         
            return cutAction(expr);
        }
    }

}
function cutSpaces(expr){
    expr = expr.replace(/[ ]/g, "");
    return expr;    
}
function normBrackets(expr){
    let brackets = 0;
    for(let i = 0; i < expr.length; i++){
        if (expr[i] == "(") brackets++;
        if (expr[i] == ")") brackets--;
        if (brackets < 0) return false;
    }
    if (brackets == 0) return true;
    return false;
}


function expressionCalculator(expr) {
    let result = 0;
    if (typeof(expr) != "string")return "";
    
    expr = cutSpaces(expr);

    if (!(normBrackets(expr))) throw "ExpressionError: Brackets must be paired";

    result = cutAction(expr);
    if (isNaN(result)) throw "TypeError: Division by zero.";
    
    return result;    
    
}

module.exports = {
    expressionCalculator
}