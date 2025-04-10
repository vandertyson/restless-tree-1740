import { useState, useEffect } from "react";

const tabs = ["packages", "accounts", "allocations", "overuse"];

export function DataTabs() {
  const [activeTab, setActiveTab] = useState("packages");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const res = await fetch(`/api/${activeTab}`);
    const d = await res.json();
    console.log("json", d)
    setData(d.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

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
        <button
          onClick={loadData}
          className="text-sm px-3 py-1 bg-green-500 text-white rounded"
        >
          🔄 Làm mới
        </button>
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
    </div>
  );
}