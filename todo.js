console.log("THis is todo list");

const form = document.getElementById("form");
const todoInput = document.getElementById("todoInput");
todoInput.focus();
const todoSubmitButton = document.getElementById("todoSubmitButton");
const todoDeleteButton = document.getElementById("todoDeleteButton");
const t_body = document.getElementById("t_body");
const shortKeyOnAll=document.getElementById('short-key-on-all');
const shortKeyOnDiv=document.getElementById('short-key-on-div');

// This object is for store the key and item's value
let objKey = [{}];
let objStatus=[{}];
let arrowMove1=0;
let arrowMove2=0;
let incrementArrowMove=0;
let clickFocusRowId=0;
let arrowUpStatus=false;
// it is only for gettin focus on input field when click on above
const h2=document.querySelector("h2");
h2.addEventListener("click",()=>{
  todoInput.focus();
  arrowMove2=0;
  arrowUpStatus=false;
});
todoInput.addEventListener('click',()=>{
  arrowMove2=0;
  arrowUpStatus=false;
});

// if reload then also show table data
if (localStorage.getItem("ItemsKey") != null) {
  showTableHead();
  objKey = JSON.parse(localStorage.getItem("ItemsKey"));
  objStatus=JSON.parse(localStorage.getItem("ItemsStatus"));
}
else{
  // if storage has no item then it button disabled 
  objKey=[{}];
  objStatus=[{}];
  todoDeleteButton.disabled=true;
}


todoDeleteButton.addEventListener("click", deleteTask);
todoSubmitButton.addEventListener("click", AddTask);
document.addEventListener('keydown',shortKeyAll);

function shortKeyAll(e){
  // it is for add the task after clicking the Keyboard shortcuts
  if(e.keyCode===13 &&e.ctrlKey){
    AddTask(e);
  }
    // it is for delete all the task after clicking the Keyboard shortcuts
  else if(e.keyCode===68&&e.ctrlKey){
    e.preventDefault();
    deleteTask();
  }
  // this is for left arrow 
  else if(e.keyCode==37){
    if(arrowMove1>0&&arrowMove1<=2){
      arrowMove1--;
      focus1(arrowMove1);
    }
    else{
      arrowMove1=2;
      focus1(arrowMove1);
    }
  }
  // this is for right arrow 
  else if(e.keyCode==39){
    if(arrowMove1>=0&&arrowMove1<2){
      arrowMove1++;
      focus1(arrowMove1);
    }
    else{
      arrowMove1=0;
      focus1(arrowMove1);
    }
  }
  // this is for upper arrow 
  else if(e.keyCode==38){
    // below both if condition is for moving arrow better 
    if(incrementArrowMove==0){
      incrementArrowMove=1;
    }
    if(incrementArrowMove==2){
      incrementArrowMove=1;
      arrowMove2--;
    }
    let arrowMoveY=Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]).length;
    if(arrowMove2>0&&arrowMove2<arrowMoveY){
      arrowMove2--;
      focus2(arrowMove2);
    }
    else{
      arrowMove2=arrowMoveY-1;
      focus2(arrowMove2);
    }
    arrowUpStatus=true;
  }
  // this is below arrow 
  else if(e.keyCode==40){
        // below both if condition is for moving arrow better 
    if(incrementArrowMove==0){
      incrementArrowMove=2;
    }
    if(incrementArrowMove==1){
      incrementArrowMove=2;
      arrowMove2++;
    }
    let arrowMoveY=Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]).length;
    if(arrowMove2>0&&arrowMove2<arrowMoveY){
      focus2(arrowMove2);
      arrowMove2++;
    }
    else{
      arrowMove2=0;
      focus2(arrowMove2++);
    }
    arrowUpStatus=false;
  }
  // remove the specific item after select with keyboard
  else if(e.keyCode==68&&(arrowMove2!=0||arrowUpStatus)){
    if(arrowUpStatus){
      arrowMove2++;
      arrowUpStatus=false;
    }
    e.preventDefault();
    if(arrowMove2!=0){
      let status=window.confirm("do you want to delete this item ?");
      if(status){
      t_body.children[arrowMove2-1].remove();
      // the written below is used for find the specific object keys 
      //which is used for delete the object key value
      // Object.keys(objKey[0])[arrowMove2-1]
      delete objKey[0][Object.keys(objKey[0])[arrowMove2-1]];
      delete objStatus[0][Object.keys(objStatus[0])[arrowMove2-1]];
        if(Object.keys(objKey[0]).length!=0){
          localStorage.setItem("ItemsKey", JSON.stringify(objKey));
          localStorage.setItem("ItemsStatus", JSON.stringify(objStatus));
        }
        else{
            localStorage.clear();
            location.reload();
        }
        t_body.innerHTML="";
        if(Object.keys(objKey[0]).length!=null){
          location.reload();
        }
        arrowMove2=0;
      }
    }
  }
  // it is for edit the specific row of table 
  else if(e.keyCode==69&&(arrowMove2!=0||arrowUpStatus)){
    e.preventDefault();
    if(arrowUpStatus){
      arrowMove2++;
    }
    if(arrowMove2!=0){
      let value=window.prompt("Update your task item: ",`${JSON.parse(localStorage.getItem('ItemsKey'))[0]
      [Object.keys(objKey[0])[arrowMove2-1]]}`);
      if(value!=null&&value!=""){
        objKey[0][Object.keys(objKey[0])[arrowMove2-1]]=value;
        localStorage.setItem("ItemsKey", JSON.stringify(objKey));
        t_body.innerHTML="";
        // showTableHead();
        location.reload();
        arrowMove2=0;
      }
    }
  }
  // for check the table row 
  else if(e.keyCode==32){
    if(arrowMove2!=0){
      objStatus[0][arrowMove2]=true;
      localStorage.setItem("ItemsStatus",JSON.stringify(objStatus));
      t_body.children[arrowMove2-1].children[2].children[0].checked=true;
      t_body.children[arrowMove2-1].children[1].style.textDecoration="line-through";
      t_body.children[arrowMove2-1].children[2].children[0].disabled=true;
      t_body.children[arrowMove2-1].children[3].children[0].disabled=true;
      // t_body.children[arrowMove2-1].children[4].children[0].disabled=true;
    }
    arrowMove2=0;
  }
}
//it has do upper element focus
function focus1(value){
  switch(value){
    case 0:
      todoInput.focus();
      arrowMove2=0;
      break;
    case 1:
      todoSubmitButton.focus();
      arrowMove2=0;
      break;
    case 2:
      todoDeleteButton.focus();
      arrowMove2=0;
      break;
  }
}
//it has do table element focus also use tabindex in html for work
function focus2(value){
  t_body.children[value].focus();
  // below code will give specific row of table 
  //t_body.children[value]
}

function deleteTask() {
  if (localStorage.getItem("ItemsKey") != null) {
    let status=window.confirm("Do you want to delete all items ?");
    if(status){
      localStorage.clear();
      location.reload();
    }
  }
}

function AddTask(e) {
  e.preventDefault();
  let taskInput = todoInput.value;
  let regex = /^[a-zA-Z0-9\+\-\_]([a-zA-z0-9_\+\- ]){2,20}$/;
  if (regex.test(taskInput)) {
    // here add the key/value respectively
    addTask1(taskInput);
    todoInput.classList.remove("is-invalid");
  } else { 
    todoInput.classList.add("is-invalid");
  }
  form.reset();
}
function addTask1(taskInput){
  // it return the key of value 
  let index = giveIndex();
  // here add the key/value respectively
  objKey[0][index] = taskInput;
  localStorage.setItem("ItemsKey", JSON.stringify(objKey));
  objStatus[0][index]=false;
  localStorage.setItem("ItemsStatus",JSON.stringify(objStatus));
  t_body.innerHTML = "";
  // showTableHead();
  location.reload();
}
function giveIndex() {
  let index;
  if (localStorage.getItem("ItemsKey") != null) {
    let length1 = Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]).length;
    // console.log(length1);
    for(let i=0;i<length1;i++){
      let keys1=Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]);
      if(i+1!=keys1[i]){
        return i+1;
      }
      if(i+1==length1){
        index=length1;
      }
    }
  } else {
    index = 0;
  }
  return index + 1;
}
function showTableHead() {
  if (localStorage.getItem("ItemsKey") != null) {
    for (
      let i = 0;
      i < Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]).length;
      i++
    ) {
      let keys1=Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]);
      addTableHead(i + 1,JSON.parse(localStorage.getItem("ItemsKey"))[0][keys1[i]]);
    }
    // coll to add eventlistener on every items
    addEventOnEveryItem();
    for (
      let i = 0;
      i < Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]).length;
      i++
    ) {
      // it is used to get collection of values of itemsstatus
      let items1=Object.values(JSON.parse(localStorage.getItem("ItemsStatus"))[0]);
      if(items1[i]){
        t_body.children[i].children[1].style.textDecoration="line-through";
        t_body.children[i].children[2].children[0].checked=true;
        t_body.children[i].children[2].children[0].disabled=true;
        t_body.children[i].children[3].children[0].disabled=true;
        // t_body.children[i].children[4].children[0].disabled=true;
      }
    }
    // location.reload();
  }
  else{
    t_body.innerHTML="";
    objKey=[{}];
    objStatus=[{}];
  }
}
function addTableHead(index, taskInput) {
  let keys1=Object.keys(JSON.parse(localStorage.getItem("ItemsKey"))[0]);

  let str = `<tr class="form-group align-middle"id="${index}"tabindex="${index}">
    <th scope="row">${index}</th>
    <td>${taskInput}</td>
    <td><input type="checkbox" name="${keys1[index-1]}" id="${
      keys1[index-1]+"_status"
    }"class="form-check-input check-status"></td>
    <td class="edit-button">
      <button type="button" class="btn btn-primary rounded-3 border-dark edit-button-ele" id="${
        keys1[index-1]+"_edit"
      }"name="${keys1[index-1]}">
        edit
      </button>
    </td>
    <td class="remove-button">
      <button type="button" class="btn btn-danger rounded-3 border-dark remove-button-ele" id="${
        keys1[index-1]+"_remove"
      }"name="${keys1[index-1]}">
        remove
      </button>
    </td>
  </tr>`;
  t_body.innerHTML += str;
}
// it add eventlistener on ever delete item and edit item
function addEventOnEveryItem() {
  t_body.addEventListener("click", editDeleteRow);
}
function editDeleteRow(e) {
// EDIT BUTTON 
  if (e.target.closest(".edit-button-ele")) {
    let value=window.prompt("Update your task item: ",`${JSON.parse(localStorage.getItem('ItemsKey'))[0][e.target.name]}`);
    if(value!=null&&value!=""){
      objKey[0][e.target.name]=value;
      localStorage.setItem("ItemsKey", JSON.stringify(objKey));
      t_body.innerHTML="";
      showTableHead();
    }
  } 
  // REMOVE BUTTON click
  else if (e.target.closest(".remove-button-ele")) {
    // it return true if press ok otherwise false 
    let status=window.confirm("Do you want to delete this ?");
    if(status){
      // delete the specific Object keyvalue form object and set remaining
      delete objKey[0][e.target.name];
      delete objStatus[0][e.target.name];
      if(Object.keys(objKey[0]).length!=0){
        localStorage.setItem("ItemsKey", JSON.stringify(objKey));
        localStorage.setItem("ItemsStatus",JSON.stringify(objStatus));
      }
      else{
        localStorage.clear();
        location.reload();
      }
      // from target to remove specific row 
      e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
      t_body.innerHTML="";
      if(Object.keys(objKey[0]).length!=null){
        showTableHead();
      }
   }
  }
  else if(e.target.closest(".check-status")){
    if(e.target.checked){
      objStatus[0][e.target.name]=true;
      localStorage.setItem("ItemsStatus",JSON.stringify(objStatus));

      e.target.parentNode.parentNode.children[1].style.textDecoration="line-through";
      e.target.parentNode.parentNode.children[2].children[0].disabled=true;
      e.target.parentNode.parentNode.children[3].children[0].disabled=true;
      // e.target.parentNode.parentNode.children[4].children[0].disabled=true;
    }
    else{
      objStatus[0][e.target.name]=false;
      localStorage.setItem("ItemsStatus",JSON.stringify(objStatus));

      e.target.parentNode.parentNode.children[1].style.textDecoration="none";
      e.target.parentNode.parentNode.children[2].children[0].disabled=true;
      e.target.parentNode.parentNode.children[3].children[0].disabled=false;
      // e.target.parentNode.parentNode.children[4].children[0].disabled=false;
    }
  }
  else{
    // take a id of row and used in shotcuts key listener 
    todoInput.focus(); 
    clickFocusRowId=e.target.parentNode.id;
  }
}
