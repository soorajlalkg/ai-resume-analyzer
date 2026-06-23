import pdf from 'pdf-parse';
import type { UploadedFile } from 'express-fileupload';

export class PdfService {
  static async extractText(file: UploadedFile): Promise<string> {
    try {
      const data = await pdf(file.data);

      return data.text.trim();
    } catch (e) {
      throw e;
    }
  }
}
