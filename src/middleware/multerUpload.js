import multer from 'multer'

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

export default upload

