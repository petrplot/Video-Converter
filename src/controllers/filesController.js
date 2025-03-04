
import {fileUploadService} from '../services/fileService.js'
import {fileDownloadService} from '../services/fileService.js'
import upload from '../middleware/multerUpload.js'

import util from 'util';
const uploadMiddleware = util.promisify(upload); // Делаем `upload` поддерживающим `await`

async function uploadFile(request, response) {
    try {
        // Ожидаем загрузку файлов
        await uploadMiddleware(request, response);

        if (!request.files || !request.files.video) {
            throw new Error('Файлы не загружены');
        }

        // Получаем массив файлов
        const arrayFiles = request.files.video;
        
        // Обрабатываем файлы через сервис
        const mp4FileName = await fileUploadService(arrayFiles);

        // Возвращаем ссылку
        response.status(200).json({
            link: `http://localhost:3001/files/download/${mp4FileName}`
        });
        
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        response.status(400).json({ error: error.message });
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