import { useState, useEffect } from "react";

const tabs = ["packages", "accounts", "allocations"];

export function DataTabs() {
  const [activeTab, setActiveTab] = useState("packages");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({}); // tạm lưu dữ liệu đang nhập

  const loadData = async () => {
    setLoading(true);
    const res = await fetch(`/api/${activeTab}`);
    const d = await res.json();
    setData(d.data || d); // do một số API trả {data: [...]}
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSubmit = async () => {
    await fetch(`/api/${activeTab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    });
    setShowModal(false);
    setFormState({});
    loadData();
  };

  const renderFormFields = () => {
    if (activeTab === "packages") {
      return (
        <>
          <input placeholder="Tên gói" onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="border px-2 py-1 w-full" />
          <input placeholder="Giá (VND)" type="number" onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })} className="border px-2 py-1 w-full" />
          <input placeholder="ID cấp phát" type="number" onChange={(e) => setFormState({ ...formState, allocation_policy_id: Number(e.target.value) })} className="border px-2 py-1 w-full" />          
        </>
      );
    }

    if (activeTab === "accounts") {
      return (
        <>
          <input placeholder="Mã khách hàng" onChange={(e) => setFormState({ ...formState, customer_id: e.target.value })} className="border px-2 py-1 w-full" />
          <input placeholder="Loại tài khoản" onChange={(e) => setFormState({ ...formState, type: e.target.value })} className="border px-2 py-1 w-full" />
          <input placeholder="Số dư" type="number" onChange={(e) => setFormState({ ...formState, balance: Number(e.target.value) })} className="border px-2 py-1 w-full" />
        </>
      );
    }

    if (activeTab === "allocations") {
      return (
        <>
          <input placeholder="ID chính sách cấp phát" type="number" onChange={(e) => setFormState({ ...formState, policy_id: Number(e.target.value) })} className="border px-2 py-1 w-full" />
          <input placeholder="Loại tài khoản" onChange={(e) => setFormState({ ...formState, account_type: e.target.value })} className="border px-2 py-1 w-full" />
          <input placeholder="Số lượng" type="number" onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })} className="border px-2 py-1 w-full" />
        </>
      );
    }    
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-3 py-1 rounded ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              {tab === "packages"
                ? "📦 Gói cước"
                : tab === "accounts"
                ? "👛 Tài khoản"
                : tab === "allocations"
                ? "🎁 Cấp phát"
                : "🔥 Chính sách trừ"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="text-sm px-3 py-1 bg-green-500 text-white rounded"
          >
            🔄 Làm mới
          </button>
          {/* <button
            onClick={() => setShowModal(true)}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
          >
            ➕ Thêm
          </button> */}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : (
          <>
            <h2 className="text-md font-bold capitalize mb-2">{activeTab}</h2>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-200">
                  {data[0] &&
                    Object.keys(data[0]).map((key) => (
                      <th key={key} className="px-2 py-1 text-left border">
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-2 py-1 border">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Thêm {activeTab}</h2>
            <div className="space-y-2">{renderFormFields()}</div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">Hủy</button>
              <button onClick={handleSubmit} className="px-3 py-1 bg-blue-600 text-white rounded">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
