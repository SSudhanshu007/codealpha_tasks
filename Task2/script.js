var screen = document.getElementById("screen");
var expression = "";
var resultShown = false;

// Update the calculator screen
function updateScreen(value) {
  if (value === "") {
    screen.textContent = "0";
  } else {
    screen.textContent = value;
  }
}

function getLastChar() {
  return expression.charAt(expression.length - 1);
}

// Check if a character is an operator
function isOperator(char) {
  if (char === "+" || char === "-" || char === "*" || char === "/") {
    return true;
  }
  return false;
}

// Check if the current number already has a decimal point
function currentNumberHasDecimal() {
  var i = expression.length - 1;
  while (i >= 0) {
    var char = expression.charAt(i);
    if (char === ".") {
      return true;
    }
    if (isOperator(char)) {
      return false;
    }
    i = i - 1;
  }
  return false;
}

// Add a number or decimal point to the expression
function appendNumber(number) {
  if (resultShown) {
    resultShown = false;
    if (number === ".") {
      expression = "0.";
    } else {
      expression = number;
    }
  } else {
    if (number === ".") {
      if (currentNumberHasDecimal()) {
        return;
      }
      if (expression === "" || isOperator(getLastChar())) {
        expression = expression + "0";
      }
    }
    expression = expression + number;
  }
  updateScreen(expression);
}

// Add an operator to the expression
function appendOperator(operator) {
  if (resultShown) {
    resultShown = false;
  }

  if (expression === "") {
    if (operator === "-") {
      expression = "-";
      updateScreen(expression);
    }
    return;
  }

  var lastChar = getLastChar();

  if (lastChar === "+" || lastChar === "*" || lastChar === "/") {
    if (operator === "-") {
      var secondLast = expression.charAt(expression.length - 2);
      if (secondLast === "-") {
        return;
      }
      expression = expression + operator;
    } else {
      expression = expression.slice(0, -1) + operator;
    }
  } else if (lastChar === "-") {
    if (operator === "-") {
      return;
    }
    expression = expression.slice(0, -1) + operator;
  } else {
    expression = expression + operator;
  }

  updateScreen(expression);
}

// Clear the calculator
function clearAll() {
  expression = "";
  resultShown = false;
  updateScreen(expression);
}

// Delete the last character
function deleteLast() {
  if (resultShown) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  updateScreen(expression);
}

// Check if the expression only contains valid characters
function isValidExpression(text) {
  var i = 0;
  while (i < text.length) {
    var char = text.charAt(i);
    var isNumber = char >= "0" && char <= "9";
    var isAllowed = char === "+" || char === "-" || char === "*" || char === "/" || char === ".";
    if (isNumber === false && isAllowed === false) {
      return false;
    }
    i = i + 1;
  }
  return true;
}

// Calculate the result of the expression
function calculate() {
  if (expression === "") {
    return;
  }

  if (isValidExpression(expression) === false) {
    expression = "";
    resultShown = false;
    updateScreen("Error");
    return;
  }

  try {
    var result = eval(expression);
    if (result === Infinity || result === -Infinity || isNaN(result)) {
      throw new Error("Invalid result");
    }
    var rounded = Math.round(result * 100000000) / 100000000;
    expression = rounded.toString();
    resultShown = true;
    updateScreen(expression);
  } catch (error) {
    expression = "";
    resultShown = false;
    updateScreen("Error");
  }
}

// Handle button clicks
function handleButtonClick(event) {
  var target = event.target;
  if (target.classList.contains("btn") === false) {
    return;
  }

  var action = target.getAttribute("data-action");
  var value = target.getAttribute("data-value");

  if (action === "number") {
    appendNumber(value);
  } else if (action === "operator") {
    appendOperator(value);
  } else if (action === "clear") {
    clearAll();
  } else if (action === "delete") {
    deleteLast();
  } else if (action === "equals") {
    calculate();
  }
}

// Handle keyboard input
function handleKeyboard(event) {
  var key = event.key;

  if (key >= "0" && key <= "9") {
    appendNumber(key);
  } else if (key === ".") {
    appendNumber(".");
  } else if (key === "+") {
    appendOperator("+");
  } else if (key === "-") {
    appendOperator("-");
  } else if (key === "*") {
    appendOperator("*");
  } else if (key === "/") {
    event.preventDefault();
    appendOperator("/");
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
}

// Attach event listeners
document.querySelector(".buttons").addEventListener("click", handleButtonClick);
document.addEventListener("keydown", handleKeyboard);
