const {readFile, writeFile} = require('fs')
const express = require ('express')
const app = express()

app.use(express.static('./public'))
app.use(express.json())

/*set todo at start to prevent restart bug*/
let todo =[]
readFile('./db/todo.json','utf-8',(err,result) =>{
	if(err) {
		return res.status(500).json('Something went wrong....')
	}
	todo = JSON.parse(result)
})

/*Read*/
app.get('/todos',(req,res)=>{
	const isPending = req.query.pending
	readFile('./db/todo.json','utf-8',(err,result) =>{
		if(err) {
			return res.status(500).json('Something went wrong....')
		}
		todo = JSON.parse(result)
		if(isPending) {
			const pendingTodo = todo.filter((t)=> t.isComplete === false)
			return res.json(pendingTodo)
		}
		res.json(todo)
	})
})

app.post('/todos',(req,res)=>{
	const newTodo = req.body.newTodo
	if(newTodo === '')
		return res.status(500).json('Something went wrong....')
	todo.push({
		id: -1,
		task: newTodo,
		isComplete: false,
	})
	for( let i = 0; i < todo.length; i ++) {
		todo[i].id = i+1
	}
	writeFile('./db/todo.json',JSON.stringify(todo),(err,result)=>{
		if(err)
			return res.status(500).json('Something went wrong....')
		res.status(200).json('OK')
	})
})

/*UPDATE*/
app.get('/todos/:id',(req,res)=>{
	const id = parseInt(req.params.id)
	const newTodo = todo.map((t)=>{
		if(t.id === id)
			t.isComplete= !(t.isComplete) 
		return t
	})
	writeFile('./db/todo.json',JSON.stringify(newTodo),(err,result)=>{
		if(err)
			return res.status(500).json('Something went wrong....')
		res.status(200).json('OK')
	})
})

/*DELETE*/
app.get('/dltbtn',(req,res)=>{
	todo = []
	writeFile('./db/todo.json',JSON.stringify(todo),(err,result)=>{
		if(err)
			return res.status(500).json('Something went wrong....')
		res.status(200).json('OK')
	})
})

/*Delete One*/
app.get('/todos/delete/:id',(req,res)=>{
	const id = parseInt(req.params.id)
	const newTodo = todo.filter((t)=> t.id !== id)

	writeFile('./db/todo.json',JSON.stringify(newTodo),(err,result)=>{
		if(err)
			return res.status(500).json('Something went wrong....')
		res.status(200).json('OK')
	})
})

app.listen(3000,()=> {
	console.log('Server listening at port 3000...')
})
