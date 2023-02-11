const userLeft = document.getElementById('left')
const userRight = document.getElementById('right')
const messageHeader=document.getElementById('message-card-header')
const groupMessage=document.getElementById('chat-messages')
const toast=document.getElementById('toast-msg')
const oneChat=document.getElementById('one-to-one-chat')
const creategroup=document.getElementById('create-group')

oneChat.addEventListener('click',onetoone)
function onetoone(){
    window.location.href="../chat-window/chat-window.html"
}

creategroup.addEventListener('click',Crategroup)
function Crategroup(){
    window.location.href="../creategroup-window/creategroup-window.html"
}

let groupId;
function createToast(msg, color = "red"){
    console.log('true')
    const div = document.createElement("div");
    div.innerHTML = msg;
    div.style.backgroundColor = color;
    div.style.padding = "1rem 2rem";
    div.style.borderRadius = "4px";
    div.style.color = "#fff";
    console.log(div.innerText)
    toast.append(div)
    console.log(toast)
    setTimeout(() => {
      div.remove();
    }, 2000);
  }
async function allLoginUsers(){
    const token=localStorage.getItem('token')
    userLeft.innerHTML=""
   await axios.get('http://localhost:3500/group/allusersgroup',{headers:{"Authorization":token}})
   .then(response=>{
    console.log(response)
    console.log(response.data.user)
    const user1=response.data.user
    user1.forEach((user)=>{
        const childNodes=`<li class="list-group-item" >${user.groupName}<input type="hidden" class="user-id" value=${user.id} /></li>`
        userLeft.innerHTML +=childNodes
    })
   })
   
}
function userClick(e){
    if(e.target.className == "list-group-item"){
        // console.log(e.target)
        // console.log(e.target.textContent)
        // console.log(e.target.children[0].value)
        const name = e.target.textContent;
        const id = +e.target.children[0].value;
        groupId=id;
        const userMessage = `Message to Group: ${name} <input type='hidden' id='msg-header-user-id' value='${id}'/>`;
        console.log(userMessage)
        messageHeader.innerHTML=userMessage;
        groupMessage.innerHTML="";
        getGroupMessages(id);
    }
}
async function  getGroupMessages(groupId =0){
    console.log('dhf')
    groupMessage.innerHTML="";
    const token=localStorage.getItem('token')
    const response= await axios.get(`http://localhost:3500/group/allgroupmessages/${groupId}`,{headers:{"Authorization":token}})
    console.log(response)
   if(response.status ==200 && response.data.groupMessages){
      const chats=response.data.groupMessages;
      chats.forEach((group)=>{
        console.log(group)
        const chatNodes=`<li class="list-group-item1">${group.userName}:${group.groupMessage}</li>`
        groupMessage.innerHTML +=chatNodes
      })
   }
}
async function chat(e){
    e.preventDefault()
    const id1 = +document.getElementById('msg-header-user-id').value;
    const group1=e.target.group2.value;
    if(!group1){
       return createToast('plzz enter the message')
    }
    try{
    const groupDetails={
       groupMessage: group1,
       groupId:id1
    }
    console.log(groupDetails)
    const token=localStorage.getItem('token')
    await axios.post('http://localhost:3500/group/groupmessage',groupDetails,{headers:{"Authorization":token}})
    .then(response=>{
        console.log(response)
        if(response.status ===200){
            createToast(response.data.message)
        }
    })
}catch(err){
    console.log(err)
    if(err.response.status===400){
        createToast(err.response.data.message)
    }
    if(err.response.status===500){
        createToast(err.response.data.message)
    }
}
}
function showScreen(){
    allLoginUsers()
    setInterval(()=>{
    getGroupMessages(groupId)
    },5000)
    }

window.addEventListener('DOMContentLoaded',showScreen)
userLeft.addEventListener('click',userClick)