
import fs from 'node:fs'
import path from 'node:path'
import multer from 'multer'

import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath.path)

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// настраиваем работу __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// настраиваем сохранение исходного файла
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "video");
    },
    filename: (req, file, cb) =>{
        cb(null,Date.now()+'.'+file.originalname.slice(file.originalname.lastIndexOf('.') + 1));
    }
})

//конфиг для multer
const upload = multer({storage, limits:{
    fields:1,
    files:1,
    fileSize:10000000000

}}).fields([
    {name: 'video', maxCount: 1},// необходимое поле в форме
])

async function uploadFile(request,response) {
    try {
        await upload(request, response, async (err)=>{
            try {
                    //непредвиденная ошибка  
                    if(err){
                        console.log('err:',err.message);
                        throw err
                    }
                    //файла не существует
                    if(!request.files.video){
                        console.log('The file does not exist'); 
                        throw Error('The file does not exist')                        
                    }
                    //файл не видео 
                    if(!request.files.video[0].mimetype.includes('video')){
                        console.log('the sent file is not a video');
                        throw Error('The selected file is not related to video files')
                    }
                    //расширение не .mov
                    const extension = request.files.video[0].originalname.split('.')                   
                    if(extension[extension.length-1] !== 'mov'){
                        console.log('the file has an incorrect extension');
                        throw Error('The file has an incorrect extension') 
                    }

                    //создаем название и путь к файлу
                    const filePath = path.join(__dirname, '/../../', request.files.video[0].path)
                    const mp4FileName = path.join(Date.now()+'.mp4')    
                    const pathFileMp4  = path.join(__dirname,'/../../','video',mp4FileName)
                    console.log(filePath);
                    

                    //конвертируем видео
                    ffmpeg(filePath) 
                        //устанавливаем параметры для нового видео
                        .videoCodec('libx264')
                        .audioCodec('libmp3lame')
                        .size('320x240')
                        //возвращаем ошибку если не удалось конвертировать файл
                        .on('error',(error)=>{
                            console.log(error);
                            throw Error('Unsuccessful video conversion')
                        })
                        //после завершения конвертации удаляем исходный файл
                        .on('end', function() {
                            console.log('Processing finished !')
                            fs.unlink(filePath, (error) => {
                                if (error) return console.log('unlink error:', error)
                                console.log("File deleted");
                            })
                        })
                        //сохраняем видео с расширением mp4
                        .save(pathFileMp4)
                        
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
            //получаем название файла и создаем стрим
            const fileName = request.params['filename']
            const pathFile  = path.join(__dirname,'/../../','video',fileName)
            const fileStream = fs.createReadStream(pathFile)
            //отправляем файл на клиент
            fileStream.pipe(response)
    
            //удаляем файл после скачивания
            .on('finish', (error) => {
                if (error) {
                    throw Error('The file does not exist')
                } 
                console.log("File download")
                fs.unlink(pathFile, (error) => {
                    if (error) return console.log(error)
                    console.log("File deleted")
                })
            }) 
    
    } catch (error) {
        console.log(error);
        response.status(400).json(error.message)
    }
}

export default {uploadFile, downloadFile}