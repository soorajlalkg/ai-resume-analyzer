import pdf from 'pdf-parse';
import type { UploadedFile } from 'express-fileupload';

export class PdfService {
  static async extractText(file: UploadedFile): Promise<string> {
    const data = await pdf(file.data);

    return data.text.trim();
  }
}
