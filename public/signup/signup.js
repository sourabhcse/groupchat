async function signup(e){
   
        e.preventDefault()
        try{
       const signupDetails ={
        name:  e.target.name.value,
        email: e.target.email.value,
        phonenumber:e.target.phonenumber.value,
        password:e.target.password.value
        
       }
       const response=await axios.post("http://localhost:3500/user/signup",signupDetails)
       .then(response=>{
        console.log(response)
        if(response.status ===201){
        alert(response.data.message)
        window.location.href="../login/login.html"
        } 
       })
 
    }
    catch(err){
       if(err.response.status ===401){
        alert(err.response.data.message)
       }
       if(err.response.status ===400){
        alert(err.response.data.message)
       }
       else{
        alert('something went wrong !')
       }
    }
}