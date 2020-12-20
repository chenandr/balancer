class Stack{
  constructor(){
    this.items = [];
  }
  push(entry){
    this.items.push(entry);
  }
  pop(){
    return this.items.pop();
  }
  top(){
    return this.items[this.items.length - 1];
  }
  empty(){
    return this.items.length == 0;
  }
}

function getBalanceChars(){
  //TODO: add custom characters and check for overlap
  var arr = [];
  
  if (document.getElementById("bracesCheck").checked){
    arr.push(['{','}']);
  }
  if (document.getElementById("bracketsCheck").checked){
    arr.push(['[',']']);
  }
  if (document.getElementById("parenthesesCheck").checked){
    arr.push(['(',')']);
  }
  if (document.getElementById("tagsCheck").checked){
    arr.push(['<','>']);
  }
  return arr;
}

function parse(input, arr){
  var mismatched = [];
  var rhs = new Stack();
  for(var i = 0; i < input.length; ++i){
    inChar = input[i];
    
    for (var j = 0; j < arr.length; ++j){
      if (inChar == arr[j][0]){
        //LHS Character --> Push corresponding RHS character and index
        rhs.push([arr[j][1], i + 1]);
      }
      else if (inChar == arr[j][1]){
        //RHS Character --> Check if on stack
        if (rhs.empty()){
          mismatched.push(i + 1);
          break;
        }
        else if (inChar == (rhs.top()[0])){
          rhs.pop();
          break;
        }
        else{
          mismatched.push(i + 1);
          break;
        }
      }
    }
    
  }
  //Add anything for non-empty stack
  for(; !rhs.empty();){
    mismatched.push(rhs.pop()[1]);
  }
  //TODO: Figure out a way to keep checking
  return mismatched.sort();
}

function check(){
  var input = document.getElementById("inputText").value;
  let re = /bg-.*/;
  
  if (!input) {
    var resBan = document.getElementById("resultBanner");
    resBan.classList.add("bg-danger");
    resBan.innerHTML = "<center>Please enter text or select a file to be checked<\center>";
    return;
  }
  
  arr = getBalanceChars();
  if (arr.length==0){
    var resBan = document.getElementById("resultBanner");
    resBan.classList.add("bg-danger");
    resBan.innerHTML = "<center>Please select at least 1 character to balance<\center>";
    return;
  }
  var mismatched = parse(input, arr);
  
  if(mismatched.length != 0){
    var resBan = document.getElementById("resultBanner");
    resBan.classList.remove("bg-danger");
    resBan.classList.remove("bg-success");
    resBan.classList.add("bg-warning");
    //TODO: Only print first 10 or so position
    resBan.innerHTML = "<center class='text-muted'>Mismatched characters at positions " + mismatched + "</center>";
    return;
  }
  
  var resBan = document.getElementById("resultBanner");
  resBan.classList.remove("bg-danger");
  resBan.classList.remove("bg-warning");
  resBan.classList.add("bg-success");
  resBan.innerHTML = "<center>Input is balanced!</center>";
  return;
}
