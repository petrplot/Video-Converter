import express from 'express'
import filesController from '../controllers/filesController.js'
const router = express.Router()

//эндпоинт для загрузки файла: http://localhost:3001/files/upload
router.post('/upload', filesController.uploadFile)

//эндпоинт для скачивания файла: http://localhost:3001/files/download/:filename
router.get('/download/:filename', filesController.downloadFile)

export default router