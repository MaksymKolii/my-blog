import { NextApiHandler } from 'next'
import formidable from 'formidable'
import cloudinary from '@/lib/cloudinary'
import { readFile } from '@/lib/utils'

//*  Эта конфигурация указывает Next.js не использовать встроенный bodyParser для обработки тела запроса. Это может быть полезно,  например, для обработки загрузки файлов.Вам не нужно явно импортировать config где-либо ещё — Next.js делает это за вас.

export const config = {
	api: { bodyParser: false },
}

const handler: NextApiHandler = (req, res) => {
	const { method } = req
	switch (method) {
		case 'POST':
			return uploadNewImage(req, res)
		case 'GET':
			return readAllImages(req, res)
		default:
			return res.status(404).send('Not Found!😢')
	}
}
const uploadNewImage: NextApiHandler = async (req, res) => {
	try {
		const { files } = await readFile(req)

		const imageFile = files.image as formidable.File
		const { secure_url: url } = await cloudinary.uploader.upload(
			imageFile.filepath,
			{
				folder: 'dev-blogs',
			}
		)

		res.json({ src: url })
	} catch (error: any) {
		res.status(500).json({ error: error.message })
	}
}

const readAllImages: NextApiHandler = async (req, res) => {
	try {
		const { resources } = await cloudinary.api.resources({
			resource_type: 'image',
			type: 'upload',
			prefix: 'dev-blogs',
		})

		const images = resources.map(({ secure_url }: any) => ({ src: secure_url }))
		res.json({ images })
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export default handler

//*  work but no src
// import { NextApiHandler } from 'next';
// import formidable from 'formidable';
// import cloudinary from '@/lib/cloudinary';

// export const config = {
//   api: { bodyParser: false },
// };

// const readFile = (req: any) => {
//   return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
//     const form = formidable({ multiples: true });

//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });
// };

// const uploadNewImage: NextApiHandler = async (req, res) => {
//   try {
//     console.log('Parsing request...');
//     const { files } = await readFile(req);

//     if (!files.image) {
//       console.error('No file uploaded');
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     let uploadResult;

//     if (Array.isArray(files.image)) {
//       const uploadPromises = files.image.map(file => {
//         const imageFile = file as formidable.File;
//         return cloudinary.uploader.upload(imageFile.filepath, { folder: 'dev-blogs' });
//       });
//       uploadResult = await Promise.all(uploadPromises);
//     } else {
//       const imageFile = files.image as formidable.File;
//       uploadResult = [await cloudinary.uploader.upload(imageFile.filepath, { folder: 'dev-blogs' })];
//     }

//     const urls = uploadResult.map(result => result.secure_url);

//     // res.status(200).json({ src: urls });
// 	res.status(200).json({ images: urls.map(url => ({ src: url })) });

//   } catch (error: any) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const handler: NextApiHandler = (req, res) => {
//   const { method } = req;
//   switch (method) {
//     case 'POST':
//       return uploadNewImage(req, res);
//     case 'GET':
//       return readAllImages(req, res);
//     default:
//       return res.status(404).send('Not Found');
//   }
// };

// const readAllImages: NextApiHandler = async (req, res) => {
//   try {
//     const { resources } = await cloudinary.api.resources({
//       resource_type: 'image',
//       type: 'upload',
//       prefix: 'dev-blogs',
//     });

//     const images = resources.map(({ secure_url }: any) => ({ src: secure_url }));
//     res.json({ images });
//   } catch (error: any) {
//     console.error('Error fetching images:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export default handler;
