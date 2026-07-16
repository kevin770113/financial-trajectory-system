import React from 'react';
import { useApp } from '../context/AppContext';

export default function Stage1Form() {
  const { stage1Data, updateStage1, setCurrentStage } = useApp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateStage1({ [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border-t-4 border-primary">
      <h2 className="text-2xl font-bold text-primary mb-2">第一階段：客觀數據建檔</h2>
      <p className="text-gray-500 mb-6 text-sm">請填寫最接近真實狀況的概略數字，不需翻找精確對帳單。</p>

      <div className="space-y-6">
        {/* 一、 基礎時間軸 */}
        <div>
          <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-4">一、 基礎時間軸與歷史基期</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">1. 您的目前年齡？</label>
              <input type="number" name="age" value={stage1Data.age} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="例：35" />
            </div>
            
            <div>
              <label className="block font-medium mb-1">2. 您預期在哪個年齡「大幅改變工作型態」或「完全退休」？</label>
              <p className="text-xs text-gray-500 mb-1">指不再依賴全職薪水的年紀。</p>
              <input type="number" name="retireAge" value={stage1Data.retireAge} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="例：60" />
            </div>

            <div>
              <label className="block font-medium mb-1">3. 回顧 3 年前，當時的「總資產規模」大約是多少？</label>
              <input type="number" name="pastAssets" value={stage1Data.pastAssets} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>

            <div>
              <label className="block font-medium mb-1">4. 與 3 年前相比，目前背負的「家庭絕對剛性支出」變化狀態是？</label>
              <select name="pastExpenseTrend" value={stage1Data.pastExpenseTrend} onChange={handleChange} className="w-full border rounded-lg p-2 bg-white focus:ring-2 focus:ring-accent outline-none">
                <option value="">請選擇...</option>
                <option value="A">顯著減少 (下降 20% 以上)</option>
                <option value="B">維持平穩 (增減 10% 以內)</option>
                <option value="C">溫和增加 (增加 10% - 30%)</option>
                <option value="D">結構性增加 (增加 30% 以上)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 二、 現金流量現況 */}
        <div>
          <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-4">二、 現金流量現況</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">1. 每年確定的「主動收入」大約是多少？</label>
              <input type="number" name="activeIncome" value={stage1Data.activeIncome} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>
            <div>
              <label className="block font-medium mb-1">2. 每年可預期的「被動與資產收入」大約是多少？</label>
              <input type="number" name="passiveIncome" value={stage1Data.passiveIncome} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="若無填 0" />
            </div>
            <div>
              <label className="block font-medium mb-1">3. 每年不可避免的「剛性生存支出」大約是多少？</label>
              <p className="text-xs text-gray-500 mb-1">維持基本生存與不違約，最少必須花費的金額。</p>
              <input type="number" name="rigidExpense" value={stage1Data.rigidExpense} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>
          </div>
        </div>

        {/* 三、 靜態資產與負債現況 */}
        <div>
          <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-4">三、 靜態資產與負債現況</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">1. 目前可快速動用的「安全現金」總共有多少？</label>
              <input type="number" name="safeCash" value={stage1Data.safeCash} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>
            <div>
              <label className="block font-medium mb-1">2. 目前「波動性投資資產」的現值大約多少？</label>
              <input type="number" name="investedAssets" value={stage1Data.investedAssets} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="若無填 0" />
            </div>
            <div>
              <label className="block font-medium mb-1">3. 尚未清償的「負債總額」大約多少？</label>
              <input type="number" name="debt" value={stage1Data.debt} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="若無填 0" />
            </div>
          </div>
        </div>

      </div>

      <button 
        onClick={() => setCurrentStage(2)}
        className="w-full mt-8 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
      >
        儲存並進入下一階段
      </button>
    </div>
  );
}
