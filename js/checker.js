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

var num_custom=0;
var cust_arr = [];

function getBalanceChars(){
  var arr = [];
  var char_set = new Set();
  
  if (document.getElementById("bracesCheck").checked){
    arr.push(['{','}']);
    char_set.add('{');
    char_set.add('{');
  }
  if (document.getElementById("bracketsCheck").checked){
    arr.push(['[',']']);
    char_set.add('[');
    char_set.add(']');
  }
  if (document.getElementById("parenthesesCheck").checked){
    arr.push(['(',')']);
    char_set.add('(');
    char_set.add(')');
  }
  if (document.getElementById("tagsCheck").checked){
    arr.push(['<','>']);
    char_set.add('<');
    char_set.add('>');
  }
  
  //Custom Pairs
  for (var i = 0; i < num_custom; ++i){
    var check = document.getElementById("custom-" + i);
    if (check.checked){
      if (char_set.has(cust_arr[i][0]) || char_set.has(cust_arr[i][1])){
        document.getElementById("custom_error_banner").innerHTML="Selections cannot overlap!";
        return false;
      }
      arr.push(cust_arr[i]);
      char_set.add(cust_arr[i][0]);
      char_set.add(cust_arr[i][1]);
    }
  }
  
  return arr;
}

function mismatchSort(a,b){
  if (a[0][0] == b[0][0]){
    return (a[0][1] > b[0][1] ? 1 : -1);
  }
  return (a[0][0] > b[0][0] ? 1 : -1);
}

function parse(input, arr){
  var lines = input.split('\n');
  var mismatched = []; //Format as line, col
  var rhs = new Stack();
  for (var l = 0; l < lines.length; ++l){
    var line = lines[l];
    for(var i = 0; i < line.length; ++i){
      var inChar = line[i];
      
      for (var j = 0; j < arr.length; ++j){
        if (inChar == arr[j][0]){
          //LHS Character --> Push character index and line, col position
          rhs.push([j, [l + 1, i + 1]]);
        }
        if (inChar == arr[j][1]){
          //RHS Character --> Check if on stack
          if (rhs.empty()){
            mismatched.push([[l + 1,i + 1], arr[j][1].length]);
            break;
          }
          else if (j == (rhs.top()[0])){
            rhs.pop();
            break;
          }
          else{
            mismatched.push([[l + 1,i + 1], arr[j][1].length]);
            break;
          }
        }
      }
    }
  }
  //Add anything for non-empty stack
  for(; !rhs.empty();){
    var top = rhs.pop();
    mismatched.push([top[1], arr[top[0]][0].length]);
  }
  return mismatched.sort(mismatchSort);
}

function check(){
  var input = inputEditor.getValue();
  document.getElementById("custom_error_banner").innerHTML="";
  var doc = inputEditor.getDoc();
  //Clear any previous markings
  marks = doc.getAllMarks();
  marks.forEach(function(mark){
    mark.clear();
  })
  
  if (!input) {
    var resBan = document.getElementById("resultBanner");
    resBan.classList.add("bg-danger");
    resBan.innerHTML = "<center>Please enter text or select a file to be checked<\center>";
    return;
  }
  
  arr = getBalanceChars();
  if (!arr){
    return;
  }
  if (arr.length==0){
    var resBan = document.getElementById("resultBanner");
    resBan.classList.add("bg-danger");
    resBan.innerHTML = "<center>Please select at least 1 character to balance<\center>";
    return;
  }
  var mismatched = parse(input, arr);
  
  //Unblalanced text: Change result banner, print error locations, mark in textArea
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
      str += "(" + mismatched[i][0] + "), ";
    }
    str += "(" + mismatched[mismatched.length - 1][0] + ")";
    
    resBan.innerHTML = "<center class='text-muted'>" + mismatched.length + " mismatched strings at positions (line, column): <br/>" + str + "</center>";
    
    //Mark the mismatched balance strings
    for(var i = 0; i < mismatched.length; ++i){
      row = mismatched[i][0][0] - 1;
      col = mismatched[i][0][1] - 1;
      doc.markText({line: row, ch: col}, {line: row, ch: col + mismatched[i][1]}, {css: "background-color: rgba(255, 0, 0, 0.4)"});
    }
    
    return;
  }
  
  var resBan = document.getElementById("resultBanner");
  resBan.classList.remove("bg-danger");
  resBan.classList.remove("bg-warning");
  resBan.classList.add("bg-success");
  resBan.innerHTML = "<center>Input is balanced!</center>";
  return;
}

function add_element(){
  //TODO: Check if same as others
  if (num_custom > 9){
    document.getElementById("custom_error_banner").innerHTML="Cannot add more pairs!";
    return;
  }
  var input_left=document.getElementById("custom_left").value;
  if(!input_left){
    document.getElementById("custom_error_banner").innerHTML="Fill out both fields!";
    return;
  }
  var input_right=document.getElementById("custom_right").value;
  if(!input_right){
    document.getElementById("custom_error_banner").innerHTML="Fill out both fields!";
    return;
  }
  if(input_left==input_right){
    document.getElementById("custom_error_banner").innerHTML="Left and Right must be different!";
    return;
  }
  
  for(var i = 0; i < cust_arr.length; ++i){
    if(input_left == cust_arr[i][0] && input_right == cust_arr[i][1]){
      document.getElementById("custom_error_banner").innerHTML="Pair already added!";
      return;
    }
  }
  
  //Add Element
  cust_arr.push([input_left,input_right]);
  var added_strings = document.getElementById("added_strings");
  
  added_strings.innerHTML += '<div class="form-check" id="cust_str-' + num_custom + '"><input class="form-check-input" type="checkbox" id="custom-'+ num_custom + '">' + '<label class="form-check-label" for="custom-' + num_custom + '">' + input_left + ' ... ' + input_right + '</label></div>';  
  num_custom += 1;
  
  //Clear error banner
  document.getElementById("custom_error_banner").innerHTML="";
  document.getElementById("custom_left").value = "";
  document.getElementById("custom_right").value = "";
  
  rm_btn = document.getElementById("remove_button");
  rm_btn.style.display = "block";
}

function rm_element(){
  //TODO: Remove Element
  num_custom -= 1;
  cust_arr.pop();
  document.getElementById("cust_str-" + num_custom).remove();
  
  if(num_custom == 0){
    rm_btn = document.getElementById("remove_button");
    rm_btn.style.display="none";
  }
}
