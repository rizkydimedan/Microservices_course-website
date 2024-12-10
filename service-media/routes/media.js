const express = require('express');
const router = express.Router();
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const fs = require('fs'); //require file sistem untuk delete

const {
  Media
} = require('../models');


/* Api get image media listing. */
router.get('/', async (req, res) => {
  const media = await Media.findAll({
    attributes: ['id', 'image']
  });

  // ubah array name menjadi url 
  const mappedMedia = media.map((m) => {
    m.image = `${req.get('host')}/${m.image}`;
    return m;
  });

  return res.json({
    status: 'success',
    data: mappedMedia
  });
});

/* post image media listing. */
router.post('/', (req, res, ) => {
  const image = req.body.image;
  // type image must base64
  // install base64 = npm install is-base64 base64-img --save
  if (!isBase64(image, {
      mimeRequired: true
    })) {
    return res.status(400).send({
      message: 'Invalid base64 image'
    });
  }

  base64Img.img(image, './public/images', Date.now(), async (err, filepath) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    // if success make filename data array
    // 'public/images/2234234234.png'
    const filename = filepath.split("\\").pop().split("/").pop();
    // save in public image
    const media = await Media.create({
      image: `images/${filename}`
    });
    // succes response
    return res.json({
      status: 'success',
      data: {
        id: media.id,
        image: `${req.get('host')}/images/${filename}`
      }
    });
  });
});


// Delete
router.delete('/:id', async (req, res) => {
      const id = req.params.id;

      const media = await Media.findByPk(id, { attributes: ['id', 'image',] 
        });

        // if media not found
      if (!media) {
        return res.status(404).json({
          status: 'error',
          message: 'media not found'
        });
      }

      //unlink images file 
      fs.unlink(`./public/${media.image}`, async (err) => {
          if (err) {
            return res.status(400).json({
              status: 'error',
              message: err.message
            });
          }
          
            await media.destroy();
          // succes response
            return res.json({
              status: 'success',
              message: 'image deleted'
            });
          });
      });

    module.exports = router;