# Конвертер видеофайла формата *.mov* в формат *.mp4*

## Запуск сервера

установить **node.js v20+**\
запустить команду `npm init`\
запустить команду `npm start`

> настроить **_cors_** либо установить и включить плагин **_cors unblock_** в браузере **_chrome_**

## Загрузка файла 

`http://localhost:3001/upload` url адрес для загрузки файла

метод **post**\
заголовок **multipart/form-data**\
название поля **video**\
у файла должен быть `mimetype:"video/*"` расширение `.mov`

возвращает ссылку на переформатированный файл \
например `http://localhost:3001/download/12334456869.mp4`
