const multer = require('multer')

const storage = multer.diskStorage({ 
destination: function(request, file, callback) {
        callback(null, './uploads/')
    }, 
    filename: function(request, file, callback) {
        callback(null, Date.now() + '_' + file.originalname)
    }
})
const fileFilter = (request, file, callback) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        callback(null, true)  
    } else {
        return callback(new Error('Only image files are allowed!'), false);
    }
}
module.exports = upload = multer({ 
    storage:  storage, 
    limits: { fileSize: 5 * 1024 * 1024 },
   fileFilter: fileFilter
}) 

