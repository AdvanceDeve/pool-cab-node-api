const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Invalid file type!" });
    }
     
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
  
      return res.status(200).json({ message: "File uploaded successfully!", file: newFile });
    }else{
      return res.status(400).json({ message: "doc_type is manadetary"});
    }

    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.fileApprove = async (req, res) => {
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


exports.getFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      where:{
        user_id:req.body.id
      }
    });
 
    const formattedFiles = files.map(file => ({
      filename: file.filename,
      uploaded_at: file.createdAt.toISOString().split('T')[0],
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      fileType: file.fileType // include this!
    }));

    return res.status(200).json(formattedFiles);
     
  }catch (error){
    console.log(error)
  }
}