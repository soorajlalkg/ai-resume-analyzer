import { QdrantClient } from '@qdrant/js-client-rest';
import config from '../../config/config';

export const qdrant = new QdrantClient({
  url: config.QDRANT_URL,
});
