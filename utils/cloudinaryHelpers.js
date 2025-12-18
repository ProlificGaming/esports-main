const cloudinary = require("../configurations/cloudinaryConfig");

/** |Cloudinary Helpers|
 * Adds abstraction and changes to the cloudinary database through code. 
 */

// deleteFromCloudinary(): Will delete all the image files from the cloudinary database. 
const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;

    try{
        await cloudinary.uploader.destroy(publicId); 
    } catch(err){
        // TODO: View later to add a template if needed. 
        console.error("Cloudinary delete failed: ", err); 
    }
}

module.exports = { deleteFromCloudinary }; 