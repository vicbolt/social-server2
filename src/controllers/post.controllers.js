const models = require('../models/index')

const fs = require('fs/promises')
const path = require('path') // lo instalamos para usar fs

const upload = async (req,res) => {
    try{
        const { title, description, ownerId } = req.body

        const owner = await models.user.findById(ownerId)
        if(!owner){
            return res.status(400).json({error: 'El usuario no existe'})
        }

        const hostname = 'http://localhost:3200/'
        const file = req.file
        const filename = hostname + file.filename


        const post = await models.post.create({
            image: filename,
            title,
            description,
            owner
        })

        return res.status(201).json({ post })

    }catch(error){
        return res.json({error: 'No se ha podido subir la imagen'})
    }
}

const recentUploads = async (req, res) => {
    try{
        const uploads = await models.post.find().sort({ createdAt: "desc"}).limit(6)

        return res.json({uploads})

    }catch(error){
        return res.status(400).json({error: ' No se pudo acceder a subidas recientes'})
    }
}

const stats = async(req, res) => {
    try{  //como no enviamos nada en el cuerpo, no tenemos que requerir nada.

        const images = await models.post.countDocuments()     // es una funcion que nos permite contar el número de doc que hay, en este caso de post ya que solo hay una imagen por post

        const comments = await models.comment.countDocuments()  

        let likes = 0 
        let views = 0 
        const posts = await models.post.find()
        for (const post of posts){
            likes = likes + post.likes
            views = views + post.views
        }

        return res.status(202).json({ images, comments, likes, views })

    }catch(error){
        return res.status(404).json({error: 'No se pudo acceder a los datos de Stats'})
    }
}

const mostPopular = async (req, res) => {
    try{
        const likes = await models.post.find().sort({ likes: "desc"}).limit(6)

        return res.json({likes})

    }catch(error){
        return res.status(400).json({error: ' No se pudo acceder a subidas recientes'})
    }
}

const details = async (req, res) => {
    try{
        const {postId} = req.params

        const post = await models.post.findById(postId) // con esto obtenemos el post, pero necesitamos los comentarios tb:

        const comments = await models.comment.find({ post })  // buscamos todos los comments que esten relacionados con el post


        return res.status(200).json({ post, comments })

    } catch (error){
        return res.status(400).json({error: 'No se han podido encontrar los detalles'})
    }
}

const remove = async (req, res) => {
    try{

        //obtener y validar el post a través del ID
        const { postId } = req.body 

        const post = await models.post.findById(postId) 
        if (!post){
            return res.status(400).json({error: 'No existe el post que se quiere eliminar'})
        }

        //borrar imagen
        const imageSplit = post.image.split('/')
        const fileName = imageSplit[imageSplit.length - 1] //aqui ya tenemos el nombre de la foto
        await fs.unlink(path.resolve('./src/statics/'+ fileName)) //nos permite borrar la imagen junto  con el codigo anterior
        
        //borrar comentarios y el post
        const comments = await models.comment.deleteMany({ post: postId }) //borramos los comentarios
        const postDeleted = await models.post.findByIdAndRemove(postId) // borramos el post


        return res.status(201).json({ comments, postDeleted })

    }catch(error){
        return res.status(400).json({error: 'No se ha podido eliminar el post'})
    }
}

const like = async (req, res) => {
    try{
        const { postId } = req.body

        const post = await models.post.findById(postId)
        if(!post){
            return res.status(400).json({error: 'No existe el post al que se quiere hacer like'})
        }

        post.likes = post.likes + 1
        await post.save()

        return res.status(200).json({ post })

    }catch (error){
        return res.status(400).json({error: 'No se ha podido contar los likes'})
    }
}

const view = async (req, res) => {
    try{

        const { postId } = req.body

        const post = await models.post.findByIdAndUpdate( postId, {$inc:{views:1}}, {new: true})

        return res.status(200).json({ post })

        

    }catch(error){
        return res.status(400).json({erorr: 'No se han podido actuaizar las views'})
    }
}

module.exports = {
    upload,
    recentUploads,
    stats,
    mostPopular,
    details,
    remove,
    like,
    view
}