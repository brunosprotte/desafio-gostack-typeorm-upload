import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError(`Invalid operation type: $${type}`, 400);
    }

    if (type === 'income' && value <= 0) {
      throw new AppError(
        `Incoming value must be positive, valaue: $${value}`,
        400,
      );
    }

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && (!balance || value > balance.total)) {
      throw new AppError(`Not enough founds, balance: $${balance.total}`, 400);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
    });

    if (category) {
      let dbCategory = await categoriesRepository.findOne({
        where: { title: category },
      });

      if (!dbCategory) {
        dbCategory = categoriesRepository.create({
          title: category,
        });

        dbCategory = await categoriesRepository.save(dbCategory);
      }
      transaction.category_id = dbCategory.id;
    }

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
