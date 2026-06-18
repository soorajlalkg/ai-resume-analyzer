import { embeddings } from '../../ai/llm/embeddings';
import { qdrant } from '../../ai/vector/qdrant';

export class ResumeVectorService {
  static async store(resumeId: string, text: string) {
    const vector = await embeddings.embedQuery(text);

    await qdrant.upsert('resumes', {
      points: [
        {
          id: resumeId,
          vector,
          payload: {
            resumeId,
          },
        },
      ],
    });
  }
}
