import formidable from "formidable";
import { NextApiRequest } from "next";

interface FormidablePromise {
  files: formidable.Files;
  body: formidable.Fields;
}

export const readFile = (req: NextApiRequest): Promise<FormidablePromise> => {
  //* formidable по умолчанию обрабатывает все поля как массивы.
  const form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ files, body: fields });
    });
  });
};
