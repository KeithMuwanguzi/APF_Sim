
import { useEvents, useNews, useHomepage } from '../hooks/useCMS';

function TestCMS() {
  
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { news, loading: newsLoading, error: newsError } = useNews();
  const { data: homepageData, loading: homeLoading, error: homeError } = useHomepage();

  const renderSection = (
    title: string,
    data: any[],
    loading: boolean,
    error: string | null
  ) => (
    <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ color: '#7E49B3', marginBottom: '10px' }}>
        {title} ({data ? (Array.isArray(data) ? data.length : '1 Object') : 0})
      </h2>
      
      {loading && <p style={{ color: '#666' }}>Loading...</p>}
      
      {error && (
        <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}
      
      {!loading && !error && (!data || (Array.isArray(data) && data.length === 0)) && (
        <div style={{ padding: '10px', background: '#ffc', color: '#660', borderRadius: '4px' }}>
          No data found. Add content in Strapi admin panel.
        </div>
      )}
      
      {!loading && !error && data && (
        <details>
          <summary style={{ cursor: 'pointer', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
            View Data (Click to expand)
          </summary>
          <pre style={{ 
            background: '#f9f9f9', 
            padding: '15px', 
            borderRadius: '4px', 
            overflow: 'auto',
            fontSize: '12px',
            marginTop: '10px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#3C096C', marginBottom: '10px' }}>
          🧪 CMS Integration Test
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Testing the connection with deep population for images.
        </p>
      </div>

      {renderSection('Homepage (Deep Populated)', homepageData, homeLoading, homeError)}
      {renderSection('Events', events, eventsLoading, eventsError)}
      {renderSection('News Articles', news, newsLoading, newsError)}

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#f0f0f0', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3 style={{ marginTop: 0 }}>Active Endpoints:</h3>
        <ul style={{ marginBottom: 0 }}>
          <li><code>GET /api/homepage?populate=...</code> (Deep)</li>
          <li><code>GET /api/news-items?populate=*</code></li>
          <li><code>GET /api/events?populate=*</code></li>
        </ul>
      </div>
    </div>
  );
}

export default TestCMS;