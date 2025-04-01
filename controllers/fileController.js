const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Invalid file type!" });
    }
    console.log('req.file:',req.file)
    console.log('req.body:',req.body)
    console.log('req.user:',req.user)

    if(req.body.doc_type != ''){
      var doc_array = [
        'license','rcbook','attachment'
      ];
      var _is_approved = '';
      if(doc_array.includes(req.body.doc_type)){
        _is_approved = 'pending'; 
      }else{
        _is_approved = 'approved';
      }

      var _is_delete = 0;
       
      const newFile = await File.create({
        user_id: req.user.id,
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        doc_type: req.body.doc_type,  
        is_approved: _is_approved,
        is_delete: _is_delete,
        created_by: req.user.id,
        updated_by: req.user.id,
      });
  
      res.status(200).json({ message: "File uploaded successfully!", file: newFile });
    }else{
      res.status(400).json({ message: "doc_type is manadetary"});
    }

    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.file_approve = async (req, res) => {
  try {
    const {id,status} = req.body;
    if(req.user.role == 'admin'){
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status
    file.is_approved = status;
    await file.save();

    return res
      .status(200)
      .json({ message: `Booking ${status} successfully`, booking });
    }else{
      res.status(400).json({ message: 'Access denied.Bad Request'});
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}