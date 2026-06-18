import { embeddings } from '../../ai/llm/embeddings';
import { qdrant } from '../../ai/vector/qdrant';

export class JobVectorService {
  static async store(jobId: string, description: string) {
    const vector = await embeddings.embedQuery(description);

    await qdrant.upsert('jobs', {
      points: [
        {
          id: jobId,
          vector,
          payload: {
            jobId,
          },
        },
      ],
    });
  }
}
