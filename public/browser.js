const tableDOM= document.querySelector('#table')
const pendingDOM= document.querySelector('#pending')
const allDOM= document.querySelector('#all')
const createBtn= document.querySelector('#create-btn')
const inputEl= document.querySelector('#input-el')
const deleteBtn= document.querySelector('#deleteall-btn')

let data =[]
const tableHeader =`
		<tr>
			<th>Id</th>
			<th>Task</th>
			<th>Status</th>
		</tr>
`
const render = () => {
	let tableContent = ''
		data.map((todo)=>{
			tableContent +=`
					<tr>
						<td>${todo.id}</td>
						<td>${todo.task}</td>
						<td>${todo.isComplete}
							<div id="delete" onClick="handleDelete(event)">delete</div>
							<div id="done" onClick="handleComplete(event)">done</div>
						</td>
					</tr>
			`
	})
	tableDOM.innerHTML = tableHeader + tableContent
}

/*Delete One Task*/
const handleDelete = async (event) => {
	// made it up with trial and error xD works as of now 
	const el = event.path[2].firstElementChild.innerHTML 
	await fetch(`todos/delete/${el}`)
	getData() 
}

/*Update*/
const handleComplete= async (event) => {
	// made it up with trial and error xD works as of now 
	const el = event.path[2].firstElementChild.innerHTML 
	await fetch(`todos/${el}`)
	getData() 
}

/*Get All*/
const getData = async () =>{
	try {
		const res = await fetch('/todos')
		data = await res.json()
		render()
	} catch (err) {
		console.log(err)
	}
}
getData() //run first time 

/*Get Pending elements only*/
pendingDOM.addEventListener('click', async ()=>{
	try {
		const res = await fetch('/todos/?pending=true')
		data = await res.json()
		render()
	} catch (err) {
		console.log(err)
	}
})

allDOM.addEventListener('click', ()=>{
	getData()
})

let newTodo =''
inputEl.addEventListener('change',(e)=>{
	newTodo=e.target.value
})


/*Create task*/
createBtn.addEventListener('click', async ()=>{
	try {
			const res = await fetch('/todos/',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				newTodo
			})
		})
		const confirmation = await res.json()
		console.log(confirmation)
		await getData()
	} catch (err) {
		console.log(err)
	}
})

/*Delete Task*/
deleteBtn.addEventListener('click', async()=>{
	try {
		const res = await fetch('/dltbtn')
		console.log(res)
		data = await res.json()
		console.log(data)
		getData()
	} catch(err) {
		console.log(err)
	}
})

