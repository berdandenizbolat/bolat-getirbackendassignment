const requestForm=document.querySelector("form")
const requestInfo=document.getElementById("message")
const responsePayload=document.querySelector("responsePayload")




requestForm.addEventListener("submit",(e)=>{
	e.preventDefault()
	const requested=requestInfo.value
	var result=requested
	try {
	result=JSON.parse(requested)
	}	catch(e){
		return alert("Invalid data type...")
	}
	fetch('', {
	  method: 'post',
	  headers: {
	    'Accept': 'application/json, text/plain, */*',
	    'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(result)
	}).then(res => res.json())
	  .then(res => {
	  	alert(JSON.stringify(res))
	  }).catch((e)=>{
	  		alert("Invalid Input, please enter a valid request")
	  	});		
})