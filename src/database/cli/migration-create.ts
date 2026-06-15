import { exec } from 'child_process';

const command = `npm run typeorm -- migration:generate -d src/data-source ./src/migrations/${process.argv[2]}`;

((): void => {
  exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.log('Migration generation error:', stderr);
    }
    console.log('Migration generation output:', stdout);
  });
})();
