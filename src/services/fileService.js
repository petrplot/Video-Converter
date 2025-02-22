import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ffmpegFileConverter from '../middleware/ffmpegFileConverter.js'
import path from 'node:path'
import fs from 'node:fs'

// настраиваем работу __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function fileUploadService(arrayFiles) {
    try {
         //файла не существует
        if(!arrayFiles){
            console.log('The file does not exist'); 
            throw Error('The file does not exist')                        
        }
        //файл не видео 
        if(!arrayFiles[0].mimetype.includes('video')){
            console.log('the sent file is not a video');
            throw Error('The selected file is not related to video files')
        }
        //расширение не .mov
        const extension = arrayFiles[0].originalname.split('.')                   
        if(extension[extension.length-1] !== 'mov'){
            console.log('the file has an incorrect extension');
            throw Error('The file has an incorrect extension') 
        }

        //создаем название и путь к файлу
        const filePath = path.join(__dirname, '/../../', arrayFiles[0].path)
        const mp4FileName = path.join(Date.now()+'.mp4')    
        const pathFileMp4  = path.join(__dirname,'/../../','video',mp4FileName)
        console.log(filePath);
        
        //конвертируем видео
        ffmpegFileConverter(filePath, pathFileMp4) 

        return mp4FileName
    } catch (error) {
        throw Error(error)
    }
}

export async function fileDownloadService(fileName, response) {
    try {
        //путь к файлу
        const pathFile  = path.join(__dirname,'/../../','video',fileName)   
        //создаем стрим        
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
        throw Error(error)
    }
}

