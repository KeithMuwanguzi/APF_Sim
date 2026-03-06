import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Users, FileText, Loader2, ArrowLeft } from "lucide-react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { API_V1_BASE_URL } from "../../config/api";

interface SearchResult {
  type: 'application' | 'member';
  id: number;
  name: string;
  email: string;
  status?: string;
  membership_type?: string;
  phone?: string;
  created_at?: string;
}

const SearchResults = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${API_V1_BASE_URL}/applications/search/?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (type: string) => {
    return type === 'member' ? <Users className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
  };

  const getResultLink = (result: SearchResult) => {
    // Link to the approval page for applications, or stay on search for members
    // You can update these routes when detail pages are created
    return result.type === 'application' 
      ? `/admin/approval` 
      : `/admin/approval`; // Both go to approval page for now where they can be managed
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} min-h-screen`}>
        <Header title="Search Results" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Search Results for "{query}"
                </h1>
              </div>
              
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && results.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No results found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your search terms
                  </p>
                </div>
              )}

              {!loading && !error && results.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                  
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={getResultLink(result)}
                      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 text-blue-600">
                          {getResultIcon(result.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {result.name}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {result.type}
                            </span>
                            {result.status && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                result.status === 'approved' ? 'bg-green-100 text-green-700' :
                                result.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {result.status}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600">{result.email}</p>
                          
                          {result.phone && (
                            <p className="text-sm text-gray-500 mt-1">{result.phone}</p>
                          )}
                          
                          {result.membership_type && (
                            <p className="text-sm text-gray-500 mt-1">
                              Type: {result.membership_type}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;