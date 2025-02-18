import express from 'express'
import cors from 'cors'
import router  from './routes/index.js'

// настраиваем Express
const app = express()

//добавляем cors
app.use(cors())

//обрабатываем json
app.use(express.json())

// для обработки форм с URL-encoded 
app.use(express.urlencoded({ extended: true }))

//маршрутизатор
app.use(router)

//слушаем сервер на порту 3001
app.listen(3001, ()=>{
    console.log('server ok');
})