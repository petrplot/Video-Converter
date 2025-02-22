
import {fileUploadService} from '../services/fileService.js'
import {fileDownloadService} from '../services/fileService.js'
import upload from '../middleware/multerUpload.js'

async function uploadFile(request,response) {
    try {
        //middleware multerUpload
        await upload(request, response, async (err)=>{
            try {
                //непредвиденная ошибка  
                if(err){
                    console.log('err:',err.message);
                    throw err
                }
                //получаем массив файлов из ответа с клиента
                const arrayFiles = request.files.video
                // используем сервис для обработки файла
                const mp4FileName = await fileUploadService(arrayFiles)
                // возвращаем ссылку
                response.status(200).json({
                    link:`http://localhost:3001/files/download/${mp4FileName}`
                })
    
            } catch (error) {
                console.log('bad request 1',error);
                response.status(400).json(error.message) 
            }              
        })   
    } catch (error) {
        //общая ошибка от сервера
        console.log('bad request 2',error);
        response.status(400).json(error.message) 
        
    }
}

async function downloadFile(request, response) {
    try {
        //получаем название файла и вызываем сервис
        const fileName = request.params['filename']
        await fileDownloadService(fileName, response)
    } catch (error) {
        console.log(error);
        response.status(400).json(error.message)
    }
}

export default {uploadFile, downloadFile}