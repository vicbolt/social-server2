const models = require('../models/index')


const create = async (req, res) => {

    try{
        const { description, userId, postId } = req.body 

        const user = await models.user.findById(userId)
        if(!user){
            return res.status(400).json({error: 'El usuario no existe'})
        }

        const post = await models.post.findById(postId)
        if(!post){
            return res.status(400).json({error: 'El post no existe'})
        }

        const comment = await models.comment.create({
            description,
            user: userId,
            post: postId,
        })

        return res.status(202).json({ comment })

    }catch (error){
        return res.status(400).json({error: 'No se ha podido enviar el comentario' })
    }
}


const latestComments = async (req, res) => {
   try{
       const comments = await models.comment.find().sort({ createdAt: 'desc'}).limit(6)

       return res.status(200).json({comments})

   } catch(error){
       return res.status(400).json({ error: 'No se han podido acceder a los ultimos comentarios '})
   }
}


module.exports = {

    latestComments,
    create
}