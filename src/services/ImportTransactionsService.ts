import csvParse from 'csv-parse';
import path from 'path';
import fs from 'fs';
import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import uploadConfig from '../config/upload';
import Category from '../models/Category';

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);
    const csvPath = path.join(uploadConfig.directory, filename);

    const transactions: Transaction[] = [];
    const transactionsCSV: TransactionCSV[] = [];

    const readCSVStream = fs.createReadStream(csvPath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;

      transactionsCSV.push({ title, type, value, category });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    for (const transactionCSV of transactionsCSV) {
      const { title, type, value, category } = transactionCSV;

      let dbCategory = await categoriesRepository.findOne({
        where: { title: category },
      });

      if (!dbCategory) {
        dbCategory = categoriesRepository.create({
          title: category,
        });

        dbCategory = await categoriesRepository.save(dbCategory);
      }

      const transaction = transactionRepository.create({
        title,
        type,
        value: parseFloat(value),
        category: dbCategory,
      });

      transactions.push(transaction);
    }

    const persistedTransactions = await transactionRepository.save(
      transactions,
    );
    return persistedTransactions;
  }
}

export default ImportTransactionsService;
