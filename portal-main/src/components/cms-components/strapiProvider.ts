export const strapiProvider = {
    // Collection Types (Articles, Events)
    async fetchCollection(slug: string) {
      const res = await fetch(`http://localhost:1337/api/${slug}?populate=*`);
      return res.json();
    },
  
    // Single Types (Pages)
    async fetchPage(slug: string) {
      const res = await fetch(`http://localhost:1337/api/${slug}`);
      return res.json();
    },
  
    async updatePage(slug: string, data: any) {
      const res = await fetch(`http://localhost:1337/api/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      return res.json();
    }
  };