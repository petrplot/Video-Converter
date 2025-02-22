import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'

//устанавливаем пакет для корректной работы путей в fluent-ffmpeg
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath.path)


async function ffmpegFileConverter(filePath, pathFileMp4) {
    try {
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
    } catch (error) {
        throw Error(error)
    }
}

export default ffmpegFileConverter