import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save } from "lucide-react";

const ExpenseCalculator = () => {
  // 初始化状态
  const [expenses, setExpenses] = useState([]);
  const [newAmount, setNewAmount] = useState("");
  const [newItem, setNewItem] = useState("");

  // 从本地存储加载数据
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // 保存数据到本地存储
  const saveToLocalStorage = (data) => {
    localStorage.setItem("expenses", JSON.stringify(data));
  };

  // 添加新支出
  const handleAddExpense = () => {
    if (!newAmount || !newItem) return;

    const formattedAmount = Number(newAmount).toFixed(2);
    const newExpense = {
      id: Date.now(),
      amount: formattedAmount,
      item: newItem,
      isEditing: false,
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveToLocalStorage(updatedExpenses);

    // 清空输入
    setNewAmount("");
    setNewItem("");
  };

  // 删除支出
  const handleDelete = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    saveToLocalStorage(updatedExpenses);
  };

  // 清空所有数据
  const handleClearAll = () => {
    setExpenses([]);
    localStorage.removeItem("expenses");
  };

  // 切换编辑模式
  const toggleEdit = (id) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? { ...expense, isEditing: !expense.isEditing }
          : expense
      )
    );
  };

  // 保存编辑
  const handleSaveEdit = (id, newAmount, newItem) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id
        ? {
            ...expense,
            amount: Number(newAmount).toFixed(2),
            item: newItem,
            isEditing: false,
          }
        : expense
    );
    setExpenses(updatedExpenses);
    saveToLocalStorage(updatedExpenses);
  };

  // 计算总金额
  const total = expenses
    .reduce((sum, expense) => sum + Number(expense.amount), 0)
    .toFixed(2);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">报销金额计算器</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 输入区域 */}
          <div className="flex space-x-2">
            <Input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="输入金额"
              className="w-32"
              step="0.01"
            />
            <Input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="输入报销项目"
              className="flex-1"
            />
            <Button onClick={handleAddExpense}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>

          {/* 列表区域 */}
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
              >
                {expense.isEditing ? (
                  <>
                    <Input
                      type="number"
                      defaultValue={expense.amount}
                      className="w-32"
                      step="0.01"
                      id={`amount-${expense.id}`}
                    />
                    <Input
                      type="text"
                      defaultValue={expense.item}
                      className="flex-1"
                      id={`item-${expense.id}`}
                    />
                    <Button
                      onClick={() =>
                        handleSaveEdit(
                          expense.id,
                          document.getElementById(`amount-${expense.id}`).value,
                          document.getElementById(`item-${expense.id}`).value
                        )
                      }
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="w-32">¥{expense.amount}</span>
                    <span className="flex-1">{expense.item}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEdit(expense.id)}
                    >
                      编辑
                    </Button>
                  </>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* 总计和清空按钮 */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xl font-bold">总计: ¥{total}</div>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              disabled={expenses.length === 0}
            >
              清空所有数据
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCalculator;
