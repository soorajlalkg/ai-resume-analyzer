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

  static async delete(jobId: string): Promise<void> {
    await qdrant.delete('jobs', {
      points: [jobId],
      wait: true,
    });
  }

  static async searchJobs(resumeText: string) {
    const vector = await embeddings.embedQuery(resumeText);

    return qdrant.search('jobs', {
      vector,
      limit: 5,
    });
  }

  static async semanticSearch(query: string) {
    const vector = await embeddings.embedQuery(query);

    return qdrant.search('jobs', {
      vector,
      limit: 20,
    });
  }
}
