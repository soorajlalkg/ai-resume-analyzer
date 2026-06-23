import 'reflect-metadata';
import * as readline from 'readline';
import { User } from '../entities/userEntity';
import { UserType } from '../common/enum/userTypeEnum';
import { AppDataSource } from '../data-source';

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function seedAdmin() {
  try {
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);

    const existingAdmin = await userRepo.findOne({
      where: {
        type: UserType.ADMIN,
      },
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists. Skipping seeding.');
      return;
    }

    const email = await askQuestion('Enter Admin Email: ');
    const password = await askQuestion('Enter Admin Password: ');

    const superAdmin = userRepo.create({
      name: 'Super Admin',
      email,
      password, // hashed by @BeforeInsert()
      type: UserType.ADMIN,
      is_email_verified: true,
    });

    await userRepo.save(superAdmin);

    console.log('✅ Admin created successfully.');
  } catch (error) {
    console.error('❌ Seeder failed:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedAdmin();
