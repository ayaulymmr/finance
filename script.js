// Singleton Pattern for Budget Management
const BudgetManager = (function () {
    let instance;
    let budget = 0;
    let totalExpenses = 0;

    function createInstance() {
        return {
            setBudget(amount) {
                budget = amount;
                this.updateRemainingBudget();
            },
            addExpense(amount) {
                totalExpenses += amount;
                this.updateRemainingBudget();
                this.notifyObservers();
            },
            updateRemainingBudget() {
                const remaining = budget - totalExpenses;
                document.getElementById('remaining-budget').innerText = remaining >= 0 ? remaining : 'Over Budget!';
                document.getElementById('total-expenses').innerText = totalExpenses;
            },
            getBudget() {
                return budget;
            },
            getTotalExpenses() {
                return totalExpenses;
            },
            observers: [],
            subscribe(observer) {
                this.observers.push(observer);
            },
            notifyObservers() {
                this.observers.forEach(observer => observer.update(totalExpenses, budget));
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

const budgetManager = BudgetManager.getInstance();

// Observer Pattern for Expense Tracking
class ExpenseObserver {
    update(totalExpenses, budget) {
        console.log(`Updated Expenses: $${totalExpenses}, Remaining Budget: $${budget - totalExpenses}`);
    }
}

// Add Observer
const expenseObserver = new ExpenseObserver();
budgetManager.subscribe(expenseObserver);

// Factory Method Pattern for Expense Creation
class Expense {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }

    display() {
        return `${this.name}: $${this.amount.toFixed(2)}`;
    }
}

// Adapter Pattern for legacy expense data format
class LegacyExpense {
    constructor(data) {
        this.data = data;
    }

    getName() {
        return this.data.expenseName;
    }

    getAmount() {
        return this.data.amountSpent;
    }
}

class ExpenseAdapter {
    constructor(legacyExpense) {
        this.legacyExpense = legacyExpense;
    }

    display() {
        return `${this.legacyExpense.getName()}: $${this.legacyExpense.getAmount().toFixed(2)}`;
    }
}

// Facade Pattern for Simplified Interface
class FinanceFacade {
    constructor() {
        this.budgetManager = BudgetManager.getInstance();
        this.goals = [];
    }

    setBudget(amount) {
        this.budgetManager.setBudget(amount);
        document.getElementById('current-budget').innerText = amount;
    }

    addExpense(name, amount) {
        const expense = new Expense(name, amount);
        const expenseList = document.getElementById('expense-list');
        const li = document.createElement('li');
        li.innerText = expense.display();
        expenseList.appendChild(li);
        this.budgetManager.addExpense(amount);
    }

    setFinancialGoal(name, amount) {
        this.goals.push({ name, amount });
        this.displayGoals();
    }

    displayGoals() {
        const goalList = document.getElementById('goal-list');
        goalList.innerHTML = ''; // Clear previous goals
        this.goals.forEach(goal => {
            const tr = document.createElement('tr');
            const goalNameTd = document.createElement('td');
            const goalAmountTd = document.createElement('td');
            goalNameTd.innerText = goal.name;
            goalAmountTd.innerText = `$${goal.amount.toFixed(2)}`;
            tr.appendChild(goalNameTd);
            tr.appendChild(goalAmountTd);
            goalList.appendChild(tr);
        });
    }
}

const financeFacade = new FinanceFacade();

// Event listener for adding an expense
document.getElementById('add-expense').addEventListener('click', function () {
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);

    if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0) {
        financeFacade.addExpense(expenseName, expenseAmount);

        // Clear input fields
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
    } else {
        alert('Please enter a valid expense name and a positive amount.');
    }
});

// Event listener for setting the budget
document.getElementById('set-budget').addEventListener('click', function () {
    const budgetAmount = parseFloat(document.getElementById('budget-amount').value);

    if (!isNaN(budgetAmount) && budgetAmount > 0) {
        financeFacade.setBudget(budgetAmount);

        // Clear input field
        document.getElementById('budget-amount').value = '';
    } else {
        alert('Please enter a valid budget amount.');
    }
});

// Event listener for setting a financial goal
document.getElementById('set-goal').addEventListener('click', function () {
    const goalName = document.getElementById('goal-name').value;
    const goalAmount = parseFloat(document.getElementById('goal-amount').value);

    if (goalName && !isNaN(goalAmount) && goalAmount > 0) {
        financeFacade.setFinancialGoal(goalName, goalAmount);

        // Clear input fields
        document.getElementById('goal-name').value = '';
        document.getElementById('goal-amount').value = '';
    } else {
        alert('Please enter valid goal name and amount.');
    }
});

// Strategy Pattern for Calculation Methods
const CalculationStrategy = {
    simple: (expenses) => expenses.reduce((total, expense) => total + expense, 0),
    advanced: (expenses) => expenses.reduce((total, expense) => total + expense, 0) * 1.1 // 10% extra for advanced calculation
};

// Example usage of Strategy Pattern
function calculateTotalExpenses(strategy) {
    const expenses = [/* Array of expenses */]; // You would populate this from your actual expense data
    return CalculationStrategy[strategy](expenses);
}
