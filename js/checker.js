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

function pairSort(a,b){
  if (a[0] == b[0]){
    return (a[1] > b[1] ? 1 : -1);
  }
  return (a[0] > b[0] ? 1 : -1);
}

function parse(input, arr){
  var lines = input.split('\n');
  var mismatched = []; //Format as line, col
  var rhs = new Stack();
  for (var l = 0; l < lines.length; ++l){
    var line = lines[l];
    for(var i = 0; i < line.length; ++i){
      inChar = line[i];
      
      for (var j = 0; j < arr.length; ++j){
        if (inChar == arr[j][0]){
          //LHS Character --> Push corresponding RHS character and line, col position
          rhs.push([arr[j][1], [l + 1, i + 1]]);
        }
        else if (inChar == arr[j][1]){
          //RHS Character --> Check if on stack
          if (rhs.empty()){
            mismatched.push([l + 1,i + 1]);
            break;
          }
          else if (inChar == (rhs.top()[0])){
            rhs.pop();
            break;
          }
          else{
            mismatched.push([l + 1,i + 1]);
            break;
          }
        }
      }
    }
  }
  //Add anything for non-empty stack
  for(; !rhs.empty();){
    mismatched.push(rhs.pop()[1]);
  }
  //TODO: Figure out a way to keep checking
  return mismatched.sort(pairSort);
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
    
    var str = "";
    for(var i = 0; i < mismatched.length - 1; ++i){
      if (i == 15){
        str += "..., ";
        break;
      }
      str += "(" + mismatched[i] + "), ";
    }
    str += "(" + mismatched[mismatched.length - 1] + ")";
    
    resBan.innerHTML = "<center class='text-muted'>" + mismatched.length + " mismatched characters at positions (line, column): <br/>" + str + "</center>";
    return;
  }
  
  var resBan = document.getElementById("resultBanner");
  resBan.classList.remove("bg-danger");
  resBan.classList.remove("bg-warning");
  resBan.classList.add("bg-success");
  resBan.innerHTML = "<center>Input is balanced!</center>";
  return;
}
