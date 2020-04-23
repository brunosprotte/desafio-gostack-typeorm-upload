import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // NOT using SUM, and/or subquery 'cause this is just a simple exercise
    const transactions = await this.find();

    const income = transactions.reduce((sum, transaction) => {
      const parsedValue = Number.parseFloat(transaction.value.toString());
      return sum + (transaction.type === 'income' ? parsedValue : 0);
    }, 0);

    const outcome = transactions.reduce((sum, transaction) => {
      const parsedValue = Number.parseFloat(transaction.value.toString());
      return sum + (transaction.type === 'outcome' ? parsedValue : 0);
    }, 0);

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
