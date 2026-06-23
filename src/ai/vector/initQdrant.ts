import { qdrant } from './qdrant';

const VECTOR_SIZE = 1536; // text-embedding-3-small

export async function initializeQdrant() {
  const collections = await qdrant.getCollections();

  const collectionNames = collections.collections.map((c) => c.name);

  if (!collectionNames.includes('resumes')) {
    await qdrant.createCollection('resumes', {
      vectors: {
        size: VECTOR_SIZE,
        distance: 'Cosine',
      },
    });

    console.log('Created resumes collection');
  }

  if (!collectionNames.includes('jobs')) {
    await qdrant.createCollection('jobs', {
      vectors: {
        size: VECTOR_SIZE,
        distance: 'Cosine',
      },
    });

    console.log('Created jobs collection');
  }
}
