// Singleton Pattern for Budget Management
const BudgetManager = (function() {
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
                this.notifyObservers(); // Notify observers of the change
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
                this.observers.forEach(observer => observer.update(budget, totalExpenses));
            }
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

const budgetManager = BudgetManager.getInstance();

// Factory Method for creating different types of expenses
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

// Event listener for adding an expense
document.getElementById('add-expense').addEventListener('click', function() {
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseType = document.querySelector('input[name="expense-type"]:checked').value;

    let expense;
    if (expenseType === 'fixed') {
        expense = new FixedExpense(expenseName, expenseAmount);
    } else {
        expense = new VariableExpense(expenseName, expenseAmount);
    }

    if (expense.name && !isNaN(expense.amount)) {
        const expenseList = document.getElementById('expense-list');
        const li = document.createElement('li');
        li.innerText = `${expense.type} Expense - ${expense.name}: $${expense.amount.toFixed(2)}`;
        expenseList.appendChild(li);

        budgetManager.addExpense(expense.amount);

        // Clear input fields
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
    } else {
        alert('Please enter valid expense name and amount.');
    }
});

// Event listener for setting the budget
document.getElementById('set-budget').addEventListener('click', function() {
    const budgetAmount = parseFloat(document.getElementById('budget-amount').value);

    if (!isNaN(budgetAmount)) {
        budgetManager.setBudget(budgetAmount);
        document.getElementById('current-budget').innerText = budgetAmount;

        // Clear input field
        document.getElementById('budget-amount').value = '';
    } else {
        alert('Please enter a valid budget amount.');
    }
});

// Financial Goals
const goals = [];

// Event listener for setting a financial goal
document.getElementById('set-goal').addEventListener('click', function() {
    const goalName = document.getElementById('goal-name').value;
    const goalAmount = parseFloat(document.getElementById('goal-amount').value);

    if (goalName && !isNaN(goalAmount)) {
        goals.push({ name: goalName, amount: goalAmount });
        displayGoals();

        // Clear input fields
        document.getElementById('goal-name').value = '';
        document.getElementById('goal-amount').value = '';
    } else {
        alert('Please enter valid goal name and amount.');
    }
});

// Function to display goals in table format
function displayGoals() {
    const goalList = document.getElementById('goal-list');
    goalList.innerHTML = ''; // Clear previous goals
    goals.forEach(goal => {
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

// Observer Pattern for budget updates
class BudgetObserver {
    constructor(elementId) {
        this.elementId = elementId;
    }

    update(budget, totalExpenses) {
        document.getElementById(this.elementId).innerText = `Budget: $${budget}, Total Expenses: $${totalExpenses}`;
    }
}

// Example usage of Observer
const budgetObserver = new BudgetObserver('budget-info');
budgetManager.subscribe(budgetObserver);

// Strategy Pattern for budget allocation
class BudgetAllocationStrategy {
    allocate(budget, percentage) {
        return budget * (percentage / 100);
    }
}

// Example usage of Strategy
const strategy = new BudgetAllocationStrategy();
const allocatedAmount = strategy.allocate(budgetManager.getBudget(), 30); // Allocate 30% of budget
console.log(`Allocated Amount: $${allocatedAmount.toFixed(2)}`);
