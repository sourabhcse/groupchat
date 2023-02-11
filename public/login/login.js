function login(e){
    e.preventDefault()
    const loginDetails={
        email:e.target.email.value,
        password:e.target.password.value

    }
    axios.post("http://localhost:3500/user/login",loginDetails)
    .then(response=>{
        console.log(response)
        if(response.status==200){
            alert(response.data.message)
            localStorage.setItem('token',response.data.token)
            window.location.href="../chat-window/chat-window.html"
        }else{
            throw new Error(response.data.message)
        }
    })
    .catch(err=>{
        console.log(err)
        console.log(err.response.data.message)
        if(err.response.status ===400){
        document.body.innerHTML += `<div style="color:red";>${err.response.data.message}</div>`
        }
        if(err.response.status ===401){
            alert(err.response.data.message)
        }
        if(err.response.status ===404){
            alert(err.response.data.message)
        }
        

    })
    
}