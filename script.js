// Observer Pattern
class ExpenseObserver {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify(expense) {
        this.subscribers.forEach(callback => callback(expense));
    }
}

// Singleton Pattern
class BudgetManager {
    constructor() {
        if (!BudgetManager.instance) {
            this.budget = 1000; // Initialize with a sample budget
            this.expenses = [];
            BudgetManager.instance = this;
        }
        return BudgetManager.instance;
    }

    addExpense(expense) {
        this.expenses.push(expense);
        this.budget -= expense.amount;
    }

    getBudget() {
        return this.budget;
    }

    getExpenses() {
        return this.expenses;
    }
}

// Factory Method Pattern
class Expense {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }
}

class FixedExpense extends Expense {
    constructor(name, amount) {
        super(name, amount);
        this.type = 'Fixed';
    }
}

class VariableExpense extends Expense {
    constructor(name, amount) {
        super(name, amount);
        this.type = 'Variable';
    }
}

// Facade Pattern
class ExpenseFacade {
    constructor() {
        this.budgetManager = new BudgetManager();
        this.observer = new ExpenseObserver();
    }

    addExpense(type, name, amount) {
        let expense;
        if (type === 'fixed') {
            expense = new FixedExpense(name, amount);
        } else {
            expense = new VariableExpense(name, amount);
        }
        this.budgetManager.addExpense(expense);
        this.observer.notify(expense);
    }

    getBudget() {
        return this.budgetManager.getBudget();
    }

    subscribeToUpdates(callback) {
        this.observer.subscribe(callback);
    }
}

// Main script logic
const facade = new ExpenseFacade();
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const remainingBudgetDisplay = document.getElementById('remaining-budget');

// Subscribe to updates
facade.subscribeToUpdates((expense) => {
    const li = document.createElement('li');
    li.textContent = `${expense.name} (${expense.type}): $${expense.amount}`;
    expenseList.appendChild(li);
    updateRemainingBudget();
});

// Function to update remaining budget display
function updateRemainingBudget() {
    remainingBudgetDisplay.textContent = facade.getBudget().toFixed(2);
}

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const type = document.querySelector('input[name="expense-type"]:checked').value;

    if (amount > 0) {
        facade.addExpense(type, name, amount);
        form.reset();
    } else {
        alert("Please enter a positive amount.");
    }
    updateRemainingBudget();
});
