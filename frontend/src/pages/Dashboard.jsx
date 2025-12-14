import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSweets, searchSweets, purchaseSweet } from "../services/api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  useEffect(() => {
    fetchSweets();
  }, []);
  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getSweets();
      setSweets(Array.isArray(data) ? data : data.sweets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sweets");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== "")
      );
      const data = await searchSweets(params);
      setSweets(Array.isArray(data) ? data : data.sweets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handlePurchase = async (sweetId, sweetName) => {
    try {
      setError("");
      setSuccess("");
      await purchaseSweet(sweetId, 1);
      setSuccess(`Successfully purchased ${sweetName}!`);
      await fetchSweets();
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to purchase ${sweetName}`
      );
    }
  };
  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };
  const handleClearSearch = () => {
    setSearchParams({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    fetchSweets();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sweet Shop</h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.name || user?.email}!
              {isAdmin() && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Admin
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin() && (
              <Button variant="secondary" onClick={() => navigate("/admin")}>
                Admin Panel
              </Button>
            )}
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Search Sweets</h2>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Input
              label="Name"
              name="name"
              value={searchParams.name}
              onChange={handleSearchChange}
              placeholder="Search by name"
            />
            <Input
              label="Category"
              name="category"
              value={searchParams.category}
              onChange={handleSearchChange}
              placeholder="Search by category"
            />
            <Input
              label="Min Price"
              type="number"
              name="minPrice"
              value={searchParams.minPrice}
              onChange={handleSearchChange}
              placeholder="Min price"
            />
            <Input
              label="Max Price"
              type="number"
              name="maxPrice"
              value={searchParams.maxPrice}
              onChange={handleSearchChange}
              placeholder="Max price"
            />
            <div className="flex gap-2 items-end">
              <Button type="submit" variant="primary" className="flex-1">
                Search
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClearSearch}
              >
                Clear
              </Button>
            </div>
          </form>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        {/* Sweets List */}
        {isLoading ? (
          <Loading message="Loading sweets..." />
        ) : sweets.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No sweets found.</p>
            <Button variant="primary" onClick={fetchSweets} className="mt-4">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <div
                key={sweet._id || sweet.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {sweet.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Category:{" "}
                    <span className="font-medium">{sweet.category}</span>
                  </p>
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    ₹{sweet.price}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Quantity:{" "}
                    <span className="font-medium">{sweet.quantity}</span>
                  </p>
                  {sweet.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {sweet.description}
                    </p>
                  )}
                  <Button
                    variant="primary"
                    onClick={() =>
                      handlePurchase(sweet._id || sweet.id, sweet.name)
                    }
                    disabled={sweet.quantity === 0}
                    className="w-full"
                  >
                    {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
