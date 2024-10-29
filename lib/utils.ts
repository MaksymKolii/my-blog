import formidable from "formidable";
import { NextApiRequest } from "next";

interface FormidablePromise<T> {
  files: formidable.Files;
  // body: formidable.Fields;
    body: T;
}

export const readFile = <T extends object>(req: NextApiRequest): Promise<FormidablePromise<T>> => {
  //* formidable по умолчанию обрабатывает все поля как массивы.
  // const form = formidable({ multiples: true });
  const form = formidable();

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ files, body: fields as T });
    });
  });
};
